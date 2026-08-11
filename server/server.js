import http from "http";
import "dotenv/config";
import app from "./src/app.js";
import pg from "pg";
import { initSocket } from "./src/socket.js";

const PORT = process.env.PORT || 8000;

const client = new pg.Client({
  connectionString: process.env.NEON_DB_DIRECT,
});
await client.connect();
console.log("connected!");
await client.end();

const start = async () => {

    const server = http.createServer(app);

    initSocket(server);

    server.listen(PORT,"0.0.0.0",() => {
        console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode. `);
    });

}

start().catch((e) => {
    console.error("failed to start",e);
    process.exit(1); // to stop whole application we use process.exit();
})

