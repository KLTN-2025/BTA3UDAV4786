import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import roomsRoutes from "./routes/rooms.routes.js";
import panoramasRoutes from "./routes/panoramas.routes.js";
import hotspotsRoutes from "./routes/hotspots.routes.js";
import quizRoutes from './routes/quiz.routes.js';
import { sequelize } from "./models/index.js";
import { connectMongo } from "./config/db.mongo.js";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173" }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use(`/${uploadDir}`, express.static(path.join(__dirname, "..", uploadDir)));

app.use("/api/rooms", roomsRoutes);
app.use("/api/panoramas", panoramasRoutes);
app.use("/api/hotspots", hotspotsRoutes);
app.use('/api/quiz', quizRoutes);

export const init = async () => {
  await sequelize.sync({ alter: true });
  await connectMongo();
  console.log("Postgres & Mongo ready");
};

export default app;
