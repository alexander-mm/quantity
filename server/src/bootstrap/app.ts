import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { errorHandler } from "../middleware/errorHandler.js";
import routes from "../routes/index.js";

export function createApp() {

    const app = express();

    // Render (y Vercel) ponen la app detrás de un proxy — sin esto, req.ip
    // devuelve la IP interna del proxy en vez de la IP real del cliente,
    // lo cual rompe la restricción por IP del reloj checador de asistencia.
    app.set("trust proxy", 1);

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