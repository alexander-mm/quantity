import { createApp } from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

const app = createApp();

app.listen(PORT, () => {

    console.log("");

    console.log("====================================");

    console.log("🚀 ORDEPLUS Quantity API");

    console.log(`🌐 http://localhost:${PORT}`);

    console.log("====================================");

    console.log("");

});