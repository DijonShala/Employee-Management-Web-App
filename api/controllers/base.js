import mongoose from "mongoose";
import {createRequire} from "module";

const Employee = mongoose.model("Employe");
const Task = mongoose.model("Task");
const Leave = mongoose.model("Leave");
const Department = mongoose.model("department");
const Salary = mongoose.model("Salary");
const Attendance = mongoose.model("Attendance");
const require = createRequire(import.meta.url);
const employeeData = require('../../data/employee.json');
const taskData = require('../../data/tasks.json');
const leaveData = require('../../data/leaves.json');
const departmentData = require('../../data/departments.json');
const salaryData = require('../../data/salaries.json');
const attendanceData = require('../../data/attendances.json');
import importTD from "../models/importTestData.js";

/**
* @openapi
* paths:
*   /db:
*     post:
*       summary: "Insert initial data into the database."
*       operationId: "addInitialData"
*       tags:
*         - "Database Operations"
*       requestBody:
*         description: "Request body for initializing the database."
*         required: false
*       responses:
*         '200':
*           description: "Initial data inserted successfully."
*         '500':
*           description: "Error inserting initial data."
*/
const addInitialData = async (req, res) => {
    try { 
        const insertedDepartments = await Department.insertMany(departmentData);
        const departmentMap = {};
        insertedDepartments.forEach(department => {
            departmentMap[department.name] = department._id;
        });
        const employeesWithIds = employeeData.map(employee => {
            const updatedEmployee = { ...employee };
            
            if (employee.departmentId === "ObjectId_1") {
                updatedEmployee.departmentId = departmentMap["Engineering"];
            } else if (employee.departmentId === "ObjectId_2") {
                updatedEmployee.departmentId = departmentMap["Marketing"];
            } else if (employee.departmentId === "ObjectId_3") {
                updatedEmployee.departmentId = departmentMap["Programming"];
            } else if (employee.departmentId === "ObjectId_4") {
                updatedEmployee.departmentId = departmentMap["Finance"];
            } else if (employee.departmentId === "ObjectId_5") {
                updatedEmployee.departmentId = departmentMap["Sales"];
            }

            const newEmployee = new Employee(updatedEmployee);
            newEmployee.setPassword("pass123");
            updatedEmployee.hash = newEmployee.hash;
            updatedEmployee.salt = newEmployee.salt;
            return updatedEmployee;
        });

        await Employee.insertMany(employeesWithIds);
        await Leave.insertMany(leaveData);
        await Task.insertMany(taskData);
        await Salary.insertMany(salaryData);
        await Attendance.insertMany(attendanceData);
        importTD.addAdmin();
        res.status(200).json({ message: "Initial data inserted successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error inserting initial data", error: error.message });
    }
};
/**
* @openapi
* paths:
*  /db:
*    delete:
*      summary: Delete multiple employees
*      description: Deletes multiple employee records based on the provided conditions.
*      tags:
*        - "Database Operations"
*      responses:
*        200:
*          description: Successfully deleted employees
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  message:
*                    type: string
*                    example: "Employees deleted successfully."
*        400:
*          description: Bad request, invalid parameters
*        500:
*          description: Server error
*/
const deleteData = async (req, res) => {
    try {
        await Employee.deleteMany({});
        await Task.deleteMany({});
        await Leave.deleteMany({});
        await Department.deleteMany({});
        await Salary.deleteMany({});
        await Attendance.deleteMany({});
        importTD.addAdmin();
        res.status(200).json({
            message: "All data has been deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting data: ", error);
        res.status(500).json({
            message: "Error deleting data.",
            error: error.message
        });
    }
};

export default {
    addInitialData,
    deleteData
}