import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   Salary:
 *    type: object
 *    properties:
 *     _id:
 *       type: string
 *       description: unique identifier
 *     userName:
 *       type: string
 *       description: "The employee's username."
 *       example: John
 *     basicSalary:
 *       type: number
 *       format: float
 *       descripiton: "The employee's basic salary"
 *       example: 5000
 *     allowances:
 *       type: number
 *       format: float
 *       description: "The employee's allowances"
 *       example: 500
 *     deductions:
 *       type: number
 *       format: float
 *       description: "The employee's deductions"
 *       example: 300
 *     netSalary:
 *       type: number
 *       format: float
 *       description: "The employee's neto salary"
 *       example: 5200
 *     payDate:
 *       type: string 
 *       format: date-time
 *       description: "Date of payment execution"
 *       example: 2024-12-10T17:43:00.000Z
 *     __v:
 *       type: integer
 *       description: "Version key for document changes in MongoDB."
 *       readOnly: true
 *    required:
 *      - userName
 *      - basicSalary
 *      - payDate
 * 
 */
const salarySchema = new mongoose.Schema({
    userName: { 
        type: String, 
        required: [true, "Username name is required!"],
    },
    basicSalary: {
        type: Number,
        required: [true, "Basic salary is required!"],
    },
    allowances:  {
        type: Number
    },
    deductions: {
        type: Number
    },
    netSalary: {
        type: Number
    },
    payDate: {
        type: Date,
        required: [true, "Pay date is required!"],
        default: Date.now
    }
  });
  
const Salary = mongoose.model("Salary", salarySchema, "Salaries");
export default Salary