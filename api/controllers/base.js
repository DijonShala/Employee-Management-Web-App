import mongoose from "mongoose";
import {createRequire} from "module";

const Employee = mongoose.model("Employe");
const Task = mongoose.model("Task");
const Leave = mongoose.model("Leave");
const Department = mongoose.model("Department");
const Salary = mongoose.model("Salary");
const Attendance = mongoose.model("Attendance");
const require = createRequire(import.meta.url);
const employeeData = require('../../data/employee.json');
const taskData = require('../../data/tasks.json');
const leaveData = require('../../data/leaves.json');
const departmentData = require('../../data/departments.json');
const salaryData = require('../../data/salaries.json');
const attendaceData = require('../../data/attendances.json');


