import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { errorHandler } from "../middleware/errorHandler.js";
import routes from "../routes/index.js";

export function createApp() {

    const app = express();

    // Render (y Vercel) ponen la app detrás de más de un salto de proxy interno — con
    // "trust proxy": 1 (confiar solo en el salto más cercano) req.ip terminaba devolviendo
    // la IP de la propia infraestructura de Render (un puñado fijo de direcciones), no la
    // IP real del cliente, por eso cualquier tienda terminaba autorizada. Con "true" se
    // confía en toda la cadena y se toma el primer valor de X-Forwarded-For (el original),
    // que es lo correcto acá porque a la app solo se puede llegar a través de Render.
    app.set("trust proxy", true);

    app.use(cors());

    app.use(helmet());

    app.use(compression());

    app.use(morgan("dev"));

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use("/api", routes);

    app.use(errorHandler);

    return app;

}