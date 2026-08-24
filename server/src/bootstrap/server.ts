import { createServer } from "http";
import { createApp } from "./app.js";
import { initRealtime } from "../realtime/realtime.service.js";

const PORT = Number(process.env.PORT) || 3000;

const app = createApp();

const httpServer = createServer(app);

initRealtime(httpServer);

httpServer.listen(PORT, () => {

    console.log("");

    console.log("====================================");

    console.log("🚀 ORDEPLUS Quantity API");

    console.log(`🌐 http://localhost:${PORT}`);

    console.log("====================================");

    console.log("");

});
