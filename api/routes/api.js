import { Router } from "express";
const router = Router();
import ctrlEmployee from "../controllers/employee.js";
import ctrlLeave from "../controllers/leave.js";
import ctrlSalary from "../controllers/salary.js";
import ctrlAttendance from "../controllers/attendance.js";
import ctrlDepartment from "../controllers/department.js";

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

/**
 * Leave
 */
router.post("/leaves", ctrlLeave.addLeave);
router.get("/leaves", ctrlLeave.getAllLeaves);
router.get("/leaves/:userName", ctrlLeave.getEmployeeLeaves);
router.put("/leaves/:leaveId/status", ctrlLeave.updateLeaveStatus);
router.delete("/leaves/:leaveId", ctrlLeave.deleteLeave);

/**
 * Salary
 */
router.post("/salaries", ctrlSalary.addSalary);
router.get("/salaries/:userName", ctrlSalary.getEmployeeSalaries);
router.get("/salaries/month/:month/year/:year", ctrlSalary.getSalariesByMonth);
router.delete("/salaries/:salaryId", ctrlSalary.deleteSalary);

/**
 * Department
 */

router.get("/departments", ctrlDepartment.getAllDepartments);
router.get("/department/:id", ctrlDepartment.findDepartmentById);
router.post("/department", ctrlDepartment.insertDepartment);
router.put("/department/:id", ctrlDepartment.updateDepartment);
router.delete("/department/:id", ctrlDepartment.deleteDepartment);

export default router;
