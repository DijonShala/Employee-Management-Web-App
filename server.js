import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import hbsRouter from "./hbs/routes/hbs.js";
/**
 * Create server
 */
const port = process.env.PORT || 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
/**
 * Static pages
 */
app.use(express.static(join(__dirname, "public")));
/**
 * View engine (HBS) setup
 */
app.set("views", join(__dirname, "hbs", "views"));
app.set("view engine", "hbs");
/**
 * HBS routing
 */
app.use("/", hbsRouter);
/**
 * Start server
 */
app.listen(port, () => {
  console.log(`Port: ${port}`);
});
