import "dotenv/config"
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import routeClient from "./routes/index.route";
import { connectDatabase } from "./config/database";
import { connectRedis } from "./config/redis.config";
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
connectDatabase();
connectRedis();
app.use(cors({
  origin: String(process.env.PORT_FE),
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use("/api/client", routeClient)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});