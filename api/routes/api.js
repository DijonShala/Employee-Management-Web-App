import { Router } from "express";
const router = Router();
import ctrlEmployee from "../controllers/employee.js";

/**
 * Employee
 */
router.get("/employee-all", ctrlEmployee.employeeAll);
router.get("/employee/:username", ctrlEmployee.employeeReadOne);
router.post("/employee", ctrlEmployee.employeeCreate);
router.put("/employee/:employeeId", ctrlEmployee.employeeUpdateOne);
router.delete("/employee/:employeeId", ctrlEmployee.employeeDeleteOne);

export default router;
