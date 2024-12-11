import { Router } from "express";
const router = Router();
import ctrlEmployee from "../controllers/employee.js";
import ctrlLeave from "../controllers/leave.js";
import ctrlSalary from "../controllers/salary.js";
import ctrlAttendance from "../controllers/attendance.js";
import ctrlTask from "../controllers/task.js";
import ctrlDepartment from "../controllers/department.js";
//import ctrlBase from "../controllers/base.js";
import ctrlAuthentication from "../controllers/authentication.js";
import { expressjwt as jwt } from "express-jwt";
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
  algorithms: ["HS256"],
});

/**
 * Authentication
 */
router.post("/login", ctrlAuthentication.login);
/**
 * Employee
 */
router.get("/employee-all", auth, ctrlEmployee.employeeAll);
router.get("/employee/:username",auth, ctrlEmployee.employeeReadOne);
router.post("/employee", auth, ctrlEmployee.employeeCreate);
router.put("/employee/:username", auth, ctrlEmployee.employeeUpdateOne);
router.put("/employee/change-password", auth, ctrlEmployee.changePassword);
router.delete("/employee/:username", auth, ctrlEmployee.employeeDeleteOne);
router.get("/employee-filter", auth, ctrlEmployee.employeeListByMultiFilter);
/**
 * Attendance
 */
router.get(
  "/attendanceByUsername/:username",auth ,
  ctrlAttendance.attendanceByUsername
);
router.post("/clockIn", auth, ctrlAttendance.clockIn);
router.post("/clockOut", auth, ctrlAttendance.clockOut);
router.delete("/attendance/:_id", auth, ctrlAttendance.attendaceDeleteOne);
/**
 * Leave
 */
router.post("/leaves", auth, ctrlLeave.addLeave);
router.get("/leaves", auth, ctrlLeave.getAllLeaves);
router.get("/leaves/:userName", auth, ctrlLeave.getEmployeeLeaves);
router.put("/leaves/:leaveId/status", auth, ctrlLeave.updateLeaveStatus);
router.delete("/leaves/:leaveId", auth, ctrlLeave.deleteLeave);
/**
 * Salary
 */
router.post("/salaries", auth, ctrlSalary.addSalary);
router.get("/salaries/:userName", auth, ctrlSalary.getEmployeeSalaries);
router.get("/salaries/month/:month/year/:year", auth, ctrlSalary.getSalariesByMonth);
router.delete("/salaries/:salaryId", auth, ctrlSalary.deleteSalary);
/**
 * Task
 */
router.post("/tasks", auth, ctrlTask.addTask);
router.get("/tasks", auth, ctrlTask.getAllTasks);
router.get("/tasks/:userName", auth, ctrlTask.getTasksByUserName);
router.put("/tasks/:taskId/status", auth, ctrlTask.updateTaskStatus);
router.delete("/tasks/:taskId", auth, ctrlTask.deleteTask);
/**
 * Department
 */
router.get("/departments", auth, ctrlDepartment.getAllDepartments);
router.get("/department/:depname", auth, ctrlDepartment.findEmployeeAtDepartment);
router.post("/department", auth, ctrlDepartment.insertDepartment);
router.put("/department/:id", auth, ctrlDepartment.updateDepartment);
router.delete("/department/:id", auth, ctrlDepartment.deleteDepartment);
/**
 * Add and delete database
 */
/**
 * router.route("/db")
    .post(ctrlBase.addInitialData)
    .delete(ctrlBase.deleteData);
 */
export default router;
