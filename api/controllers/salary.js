import Salary from "../models/salary.js";
import Employee from "../models/employee.js";
const addSalary = async (req, res) => {
    try {
        const { userName, basicSalary, allowances, deductions, payDate } = req.body;
        const employee = await Employee.findOne({ userName });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
          }
        if (!userName || !basicSalary || !payDate) {
            return res.status(400).json({ message: "Missing required fields!" });
        }

        const netSalary = (basicSalary + (allowances || 0)) - (deductions || 0);

        const salary = new Salary({
            userName,
            basicSalary,
            allowances: allowances || 0,
            deductions: deductions || 0,
            netSalary,
            payDate,
        });

        await salary.save();

        res.status(201).json({
            message: "Salary added successfully!",
            salary,
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding salary", error: error.message });
    }
};

const getEmployeeSalaries = async (req, res) => {
    try {
        const { userName } = req.params;
        if (!userName) {
            return res.status(400).json({ message: "Employee userName is required!" });
        }
        const employee = await Employee.findOne({ userName });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
          }
        const salaries = await Salary.find({ userName });

        if (!salaries.length) {
            return res.status(404).json({ message: "No salary records found for the employee!" });
        }

        res.status(200).json({
            message: "Employee salaries fetched successfully!",
            salaries,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching salaries", error: error.message });
    }
};
const getSalariesByMonth = async (req, res) => {
    try {
        const { month, year } = req.params;

        if (!month || !year) {
            return res.status(400).json({ message: "Month and year are required!" });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const salaries = await Salary.find({
            payDate: { $gte: startDate, $lte: endDate },
        });

        if (!salaries.length) {
            return res.status(404).json({ message: "No salary records found for the specified month!" });
        }

        res.status(200).json({
            message: "Salaries fetched successfully!",
            salaries,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching salaries", error: error.message });
    }
};
const deleteSalary = async (req, res) => {
    try {
        const { salaryId } = req.params;

        if (!salaryId) {
            return res.status(400).json({ message: "Salary ID is required!" });
        }

        const deletedSalary = await Salary.findByIdAndDelete(salaryId);

        if (!deletedSalary) {
            return res.status(404).json({ message: "Salary not found!" });
        }

        res.status(200).json({
            message: "Salary deleted successfully!",
            deletedSalary,
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting salary", error: error.message });
    }
};
export default {
    addSalary,
    getEmployeeSalaries,
    getSalariesByMonth,
    deleteSalary
};