import dotenv from "dotenv";
import { app } from "./app.js";
import connctDB from "./db/index.js";
dotenv.config({ path: "./env" });

connctDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });
