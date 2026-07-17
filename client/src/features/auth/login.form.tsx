import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema} from "./login.schema";
import { useState } from "react";
import { authService } from "@/services";
import { useAuth } from "@/hooks";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
        navigate("/dashboard");
        console.log(response);

    } catch {

        toast.error("Usuario o contraseña incorrectos.");

    } finally {

        setLoading(false);

    }

}

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Usuario</label>
                <input
                    {...register("username")}
                />
                <p>{errors.username?.message}</p>
            </div>
            <br />
            <div>
                <label>Contraseña</label>
                <input
                    type="password"
                    {...register("password")}
                />
                <p>{errors.password?.message}</p>
            </div>
            <br />
           <button
    type="submit"
    disabled={loading}
>

    {

        loading

            ? "Ingresando..."

            : "Ingresar"

    }

</button>
        </form>
    );
}