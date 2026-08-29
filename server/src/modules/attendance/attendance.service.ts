import bcrypt from "bcrypt";
import { ForbiddenError, NotFoundError } from "../../shared/errors/index.js";
import { AttendanceRepository } from "./attendance.repository.js";
import { AttendanceFiltersDto } from "./attendance.dto.js";

const DEVICE_NOT_AUTHORIZED_MESSAGE =
    "Este equipo no está autorizado para marcar asistencia.";

export class AttendanceService {

    private readonly repository = new AttendanceRepository();

    async getKioskContext(ip: string) {

        const store = await this.repository.findStoreByIp(ip);

        if (!store) {
            throw new ForbiddenError(DEVICE_NOT_AUTHORIZED_MESSAGE);
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

    async clock(ip: string, userId: string, pin: string) {

        const store = await this.repository.findStoreByIp(ip);

        if (!store) {
            throw new ForbiddenError(DEVICE_NOT_AUTHORIZED_MESSAGE);
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
            const record = await this.repository.clockOut(open.id);
            return { action: "clock-out" as const, record };
        }

        const record = await this.repository.clockIn(employee.id, store.id);
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
