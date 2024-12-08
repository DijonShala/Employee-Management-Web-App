import Salary from "../models/salary.js";
import Employee from "../models/employee.js";

/**
 * @openapi
 * paths:
 *   /salaries:
 *     post:
 *       summary: Add a new salary record.
 *       description: Add a salary record for an employee, calculating net salary based on basic salary, allowances, and deductions.
 *       tags:
 *         - Salary
 *       requestBody:
 *         description: Salary details to be added.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                   description: The unique username of the employee.
 *                   example: "admin"
 *                 basicSalary:
 *                   type: number
 *                   description: The basic salary of the employee.
 *                   example: 5000
 *                 allowances:
 *                   type: number
 *                   description: Additional allowances for the employee.
 *                   example: 500
 *                 deductions:
 *                   type: number
 *                   description: Deductions from the employee's salary.
 *                   example: 200
 *                 payDate:
 *                   type: string
 *                   format: date
 *                   description: The date when the salary is paid.
 *                   example: "2024-12-01"
 *               required:
 *                 - userName
 *                 - basicSalary
 *                 - payDate
 *       responses:
 *         '201':
 *           description: <b>Succesful message</b>, with salary data.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Salary added successfully!"
 *                   salary:
 *                     $ref: '#/components/schemas/Salary'
 *         '400':
 *           description: <b>Missing</b> required fields.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Missing required fields."
 *         '404':
 *           description: Employee not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Employee not found."
 *         '500':
 *           description: Error adding salary.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error occurred."
 */

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

/**
 * @openapi
 * paths:
 *   /salaries/{userName}:
 *     get:
 *       summary: Retrieve all salary records for an employee.
 *       description: Fetch all salary records for a specific employee identified by their `userName`.
 *       tags:
 *         - Salary
 *       parameters:
 *         - name: userName
 *           in: path
 *           description: The unique username of the employee.
 *           required: true
 *           schema:
 *             type: string
 *           example: "admin"
 *       responses:
 *         '200':
 *           description: <b>Successful message</b>, with salaries data.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Employee salaries fetched successfully!"
 *                   salaries:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Salary'
 *         '400':
 *           description: Employee `userName` is required.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "'userName' is missing"
 *         '404':
 *           description: Employee or salary records not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Employee not found or no salary records found for the employee!"
 *         '500':
 *           description: Internal server error while fetching salaries.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error occurred."
 */
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
/**
 * @openapi
 * paths:
 *   /salaries/month/{month}/year/{year}:
 *     get:
 *       summary: Retrieve salaries for a specified month and year.
 *       description: Fetch all salary records for a given month and year.
 *       tags:
 *         - Salary
 *       parameters:
 *         - name: month
 *           in: path
 *           description: The month (1-12) for which salary records are to be fetched.
 *           required: true
 *           schema:
 *             type: integer
 *             minimum: 1
 *             maximum: 12
 *           example: 12
 *         - name: year
 *           in: path
 *           description: The year for which salary records are to be fetched.
 *           required: true
 *           schema:
 *             type: integer
 *           example: 2023
 *       responses:
 *         '200':
 *           description: Successfully retrieved salary records for the specified month.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Salaries fetched successfully!"
 *                   salaries:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Salary'
 *         '400':
 *           description: Missing month or year in request parameters.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Month and year are required!"
 *         '404':
 *           description: No salary records found for the specified month and year.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "No salary records found for the specified month!"
 *         '500':
 *           description: Internal server error while fetching salary records.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Error fetching salaries"
 */

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

/**
 * @openapi
 * paths:
 *   /salaries/{salaryId}:
 *     delete:
 *       summary: Delete a salary record.
 *       description: Deletes a salary record identified by the provided salary ID.
 *       tags:
 *         - Salary
 *       parameters:
 *         - name: salaryId
 *           in: path
 *           description: The unique identifier of the salary record to be deleted.
 *           required: true
 *           schema:
 *             type: string
 *           example: "60f1b5d9c1234567890abcd"
 *       responses:
 *         '200':
 *           description: <b>Successfully deleted</b> the salary record.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Salary deleted successfully!"
 *                   deletedSalary:
 *                     $ref: '#/components/schemas/Salary'
 *         '400':
 *           description: Missing salary ID in request parameters.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message:  "Salary ID is required!"
 *         '404':
 *           description: The salary record with the specified ID was not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message:  "Salary not found!"
 *         '500':
 *           description: Internal server error while attempting to delete the salary record.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message:  "Error deleting salary"
 */
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