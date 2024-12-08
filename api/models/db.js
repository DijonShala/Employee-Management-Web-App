import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import importTD from "./importTestData.js";

/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               description: "Type of error message."
 *             description:
 *               type: string
 *               description: "Detailed description of the error."
 *           required:
 *             - description
 */

let dbURI = "mongodb://127.0.0.1/Demo";
if (process.env.NODE_ENV === "production")
  dbURI = process.env.MONGODB_ATLAS_URI;
else if (process.env.NODE_ENV === "test") dbURI = "mongodb://sp-mongo-db/Demo";
mongoose.connect(dbURI);

mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}.`);
  importTD.addAddmin();

});
mongoose.connection.on("error", (err) =>
  console.log(`Mongoose connection error: ${err}.`)
);
mongoose.connection.on("disconnected", () =>
  console.log("Mongoose disconnected")
);

const gracefulShutdown = async (msg, callback) => {
  await mongoose.connection.close();
  console.log(`Mongoose disconnected through ${msg}.`);
  callback();
};
process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () =>
    process.kill(process.pid, "SIGUSR2")
  );
});
process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => process.exit(0));
});
process.on("SIGTERM", () => {
  gracefulShutdown("Cloud-based app shutdown", () => process.exit(0));
});

import "./leave.js"
import "./employee.js"
import "./salary.js"
import "./task.js"
import "./attendance.js"