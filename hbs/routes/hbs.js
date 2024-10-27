import { Router } from "express";
const router = Router();
//import main from "../controllers/main.js";
//import ctrlLocations from "../controllers/locations.js";
//import ctrlOther from "../controllers/other.js";
import ctrlClockin from "../controllers/clockin.js";
import ctrlLogin from "../controllers/login.js";
import ctrlCalendar from "../controllers/calendar.js";

//router.get("/", main);
//router.get("/", ctrlLocations.list);
router.get("/clockin", ctrlClockin.main);
router.get("/", ctrlClockin.index);

router.get("/login", ctrlLogin.main);

router.get("/calendar", ctrlCalendar.main);
router.get("/analytics", ctrlCalendar.analytics);

export default router;
