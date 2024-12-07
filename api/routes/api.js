import { Router } from "express";
const router = Router();
import ctrlEmployee from "../controllers/employee.js";
import ctrlAttendance from "../controllers/attendance.js";

/**
 * Employee
 */
router.get("/employee-all", ctrlEmployee.employeeAll);
router.get("/employee/:username", ctrlEmployee.employeeReadOne);
router.post("/employee", ctrlEmployee.employeeCreate);
router.put("/employee/:employeeId", ctrlEmployee.employeeUpdateOne);
router.delete("/employee/:employeeId", ctrlEmployee.employeeDeleteOne);
/**
 * Attendance
 */
router.get(
  "/attendanceByUsername/:username",
  ctrlAttendance.attendanceByUsername
);
router.post("/clockIn/:username", ctrlAttendance.clockIn);
router.post("/clockOut/:username", ctrlAttendance.clockOut);
router.delete("/attendance/:_id", ctrlAttendance.attendaceDeleteOne);

export default router;
