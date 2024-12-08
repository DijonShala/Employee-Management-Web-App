import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   Employee:
 *    type: object
 *    properties:
 *     _id:
 *       type: string
 *       description: unique identifier
 *     address:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           description: "Street address of the employee."
 *           example: Vecna pot 1
 *         city:
 *           type: string
 *           description: "City where the employee lives."
 *           example: Ljubljana
 *         zipCode:
 *           type: integer
 *           description: "Zip code of the employee's address."
 *           example: 1000
 *         country:
 *           type: string
 *           description: "Country where the employee resides."
 *           example: Slovenia
 *       required:
 *         - street
 *         - city
 *         - zipCode
 *         - country
 *     userName:
 *       type: string
 *       description: "The employee's username."
 *       example: admin
 *     firstName:
 *       type: string
 *       description: "The employee's first name."
 *       example: Admin
 *     lastName:
 *       type: string
 *       description: "The employee's last name."
 *       example: User
 *     email:
 *       type: string
 *       format: email
 *       description: "The employee's email address."
 *     phoneNumber:
 *       type: string
 *       description: "The employee's phone number."
 *       example: 030-123-345
 *     jobTitle:
 *       type: string
 *       description: "The employee's job title."
 *       example: administrator
 *     departmentId:
 *       type: string
 *       description: "The department ID to which the employee belongs."
 *       example: Database
 *     hireDate:
 *       type: string
 *       format: date-time
 *       description: "The employee's hire date."
 *       example: 2020-12-10T00:00:00.000Z
 *     salary:
 *       type: number
 *       format: float
 *       description: "The employee's salary."
 *       example: 5000
 *     status:
 *       type: string
 *       enum:
 *         - active
 *         - inactive
 *       description: "The employee's status (active or inactive)."
 *       default: "active"
 *       example: active
 *     __v:
 *       type: integer
 *       description: "Version key for document changes in MongoDB."
 *       readOnly: true
 *    required:
 *      - userName
 *      - firstName
 *      - lastName
 *      - email
 *      - phoneNumber
 *      - jobTitle
 *      - departmentId
 *      - hireDate
 *      - salary
 *      - status
 */
const employeeSchema = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: [true, "Username name is required!"],
  },
  firstName: {
    type: String,
    required: [true, "First name is required!"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address!"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required!"],
  },
  jobTitle: {
    type: String,
    required: [true, "Job title is required!"],
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: [true, "Department ID is required!"],
  },
  hireDate: {
    type: Date,
    required: [true, "Hire date is required!"],
  },
  salary: {
    type: Number,
    required: [true, "Salary is required!"],
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  address: {
    street: String,
    city: String,
    zipCode: String,
    country: String,
  },
});

const Employee = mongoose.model("Employe", employeeSchema, "Employee");

export default Employee;
