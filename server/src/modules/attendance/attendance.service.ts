import bcrypt from "bcrypt";
import { randomBytes, createHash } from "node:crypto";
import { ForbiddenError, NotFoundError } from "../../shared/errors/index.js";
import { ROLES } from "../../shared/constants/roles.js";
import { UserRepository } from "../user/user.repository.js";
import { AttendanceRepository } from "./attendance.repository.js";
import { AttendanceFiltersDto } from "./attendance.dto.js";

function buildNotAuthorizedMessage(ip: string): string {
    // No se muestra ningún código del equipo a propósito: la autorización la hace un
    // administrador desde el propio equipo, así un empleado no puede copiar nada para
    // marcar desde otro lado. La IP queda solo como dato para la autorización por IP.
    return `Este equipo no está autorizado para marcar asistencia. Un administrador debe autorizarlo desde este mismo equipo. (IP detectada: ${ip || "desconocida"})`;
}

function hashDeviceToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

export class AttendanceService {

    private readonly repository = new AttendanceRepository();

    private readonly userRepository = new UserRepository();

    // Un equipo autorizado (token secreto guardado en su navegador) tiene prioridad; si no
    // hay token válido se cae a la autorización por IP configurada en la tienda.
    private async resolveStore(ip: string, deviceToken: string | null) {

        if (deviceToken) {

            const device = await this.repository.findStoreByDeviceTokenHash(
                hashDeviceToken(deviceToken)
            );

            if (device) {
                await this.repository.touchDevice(device.id, ip);
                return device.store;
            }

        }

        return this.repository.findStoreByIp(ip);

    }

    private async verifyAdmin(username: string, password: string) {

        const user = await this.userRepository.findByUsername(username);

        if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
            // 403 y no 401: el cliente trata cualquier 401 como sesión vencida y cierra sesión.
            throw new ForbiddenError("Usuario o contraseña incorrectos.");
        }

        if (user.role.name !== ROLES.ADMIN) {
            throw new ForbiddenError("Solo un administrador puede autorizar equipos.");
        }

        return user;

    }

    async getEnrollableStores(username: string, password: string) {

        await this.verifyAdmin(username, password);

        return this.repository.findEnrollableStores();

    }

    async enrollDevice(
        ip: string,
        username: string,
        password: string,
        storeId: string,
        name: string
    ) {

        const admin = await this.verifyAdmin(username, password);

        const store = await this.repository.findEnrollableStoreById(BigInt(storeId));

        if (!store) {
            throw new NotFoundError("Tienda no encontrada.");
        }

        const token = randomBytes(48).toString("hex");

        const device = await this.repository.createDevice({
            storeId: store.id,
            name,
            tokenHash: hashDeviceToken(token),
            ip,
            createdBy: admin.id
        });

        return { token, device };

    }

    async findDevices(storeId?: string) {

        return this.repository.findDevices(storeId ? BigInt(storeId) : undefined);

    }

    async revokeDevice(id: string) {

        const revoked = await this.repository.revokeDevice(BigInt(id));

        if (!revoked) {
            throw new NotFoundError("Equipo no encontrado.");
        }

    }

    async getKioskContext(ip: string, deviceToken: string | null) {

        const store = await this.resolveStore(ip, deviceToken);

        if (!store) {
            throw new ForbiddenError(buildNotAuthorizedMessage(ip));
        }

        const [employees, openAttendances] = await Promise.all([
            this.repository.findStoreEmployees(store.id),
            this.repository.findOpenAttendancesByStore(store.id)
        ]);

        const openUserIds = new Set(
            openAttendances.map(item => item.userId.toString())
        );

        return {
            store: {
                id: store.id.toString(),
                name: store.name
            },
            employees: employees
                // Solo pueden marcar los empleados que ya tienen PIN configurado por el admin.
                .filter(employee => employee.attendancePin !== null)
                .map(employee => ({
                    id: employee.id.toString(),
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    clockedIn: openUserIds.has(employee.id.toString())
                }))
        };

    }

    async clock(ip: string, deviceToken: string | null, userId: string, pin: string, reason?: string) {

        const store = await this.resolveStore(ip, deviceToken);

        if (!store) {
            throw new ForbiddenError(buildNotAuthorizedMessage(ip));
        }

        const employee = await this.repository.findEmployeeInStore(
            BigInt(userId),
            store.id
        );

        if (!employee || !employee.attendancePin) {
            throw new NotFoundError("Empleado no encontrado en esta tienda.");
        }

        const validPin = await bcrypt.compare(pin, employee.attendancePin);

        if (!validPin) {
            throw new ForbiddenError("PIN incorrecto.");
        }

        const open = await this.repository.findOpenAttendance(employee.id);

        if (open) {
            const record = await this.repository.clockOut(open.id, reason);
            return { action: "clock-out" as const, record };
        }

        const record = await this.repository.clockIn(employee.id, store.id, reason);
        return { action: "clock-in" as const, record };

    }

    async findAll(filters: AttendanceFiltersDto) {

        return this.repository.findAll({
            storeId: filters.storeId ? BigInt(filters.storeId) : undefined,
            userId: filters.userId ? BigInt(filters.userId) : undefined,
            from: filters.from ? new Date(filters.from) : undefined,
            to: filters.to ? new Date(filters.to) : undefined
        });

    }

    async setPin(userId: string, pin: string) {

        const employee = await this.repository.findEmployeeById(BigInt(userId));

        if (!employee) {
            throw new NotFoundError(
                "Solo se puede configurar PIN a usuarios con rol Tienda."
            );
        }

        const hashedPin = await bcrypt.hash(pin, 10);

        return this.repository.setPin(employee.id, hashedPin);

    }

}
