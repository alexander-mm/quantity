import { useForm } from "react-hook-form";
import { onFormError } from "@/lib/form-error-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "./login.schema";
import { useState } from "react";
import { authService } from "@/services";
import { useAuth } from "@/hooks";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLES } from "@/constants/roles";


export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {
            errors
        }

    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    async function onSubmit(data: LoginSchema) {

        try {

            setLoading(true);

            const response = await authService.login(data);

            setAuth(

                response.data.token,

                response.data.user

            );

            toast.success(response.message);

            navigate(
                response.data.user.roleName === ROLES.PRODUCTION
                    ? "/parts"
                    : "/dashboard"
            );

        } catch {

            toast.error("Usuario o contraseña incorrectos.");

        } finally {

            setLoading(false);

        }

    }

    return (
        <form onSubmit={handleSubmit(onSubmit, onFormError)}>
            <div className="flex justify-between">
                <Label className="mr-2">Usuario:</Label>
                <Input
                    {...register("username")}
                />
                <p>{errors.username?.message}</p>
            </div>
            <br />
            <div className="flex justify-between">
                <Label className="mr-2">Contraseña:</Label>
                <Input
                    type="password"
                    {...register("password")}
                />
                <p>{errors.password?.message}</p>
            </div>
            <br />
            <button
                className="flex justify-between p-2 px-4 text-white bg-blue-500 shadow-lg shadow-blue-500/40 rounded-md"
                type="submit"
                disabled={loading}
            >

                {

                    loading

                        ? "Ingresando"

                        : "Ingresar"

                }

            </button>
        </form>
    );
}