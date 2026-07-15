import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { errorHandler } from "../middleware/errorHandler.js";
import routes from "../routes/index.js";

export function createApp() {

    const app = express();

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