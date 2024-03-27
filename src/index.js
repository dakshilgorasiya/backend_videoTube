import dotenv from "dotenv";
import connctDB from "./config/db.js";
dotenv.config({ path: "./env" });

connctDB();