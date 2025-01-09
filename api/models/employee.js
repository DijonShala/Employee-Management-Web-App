import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * @openapi
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       description: Employee
 *       properties:
 *         _id:
 *           type: string
 *           description: unique identifier
 *         userName:
 *           type: string
 *           description: "The employee's username."
 *           example: admin
 *         firstName:
 *           type: string
 *           description: "The employee's first name."
 *           example: Admin
 *         lastName:
 *           type: string
 *           description: "The employee's last name."
 *           example: User
 *         email:
 *           type: string
 *           format: email
 *           description: "The employee's email address."
 *           example: clockin@projekt.com
 *         password:
 *           type: string
 *           description: "Password of the employee"
 *           example: pass123
 *         phoneNumber:
 *           type: string
 *           description: "The employee's phone number."
 *           example: 030-123-345
 *         jobTitle:
 *           type: string
 *           description: "The employee's job title."
 *           example: administrator
 *         role:
 *           type: string
 *           description: "The employee's role."
 *           enum:
 *             - admin
 *             - employee
 *           default: employee
 *           example: employee
 *         departmentId:
 *           type: string
 *           description: "The department ID to which the employee belongs."
 *           example: Database
 *         hireDate:
 *           type: string
 *           format: date-time
 *           description: "The employee's hire date."
 *           example: 2020-12-10T00:00:00.000Z
 *         salary:
 *           type: number
 *           format: float
 *           description: "The employee's salary."
 *           example: 5000
 *         walletAddress:
 *           type: string
 *           description: "The employee's wallet addres."
 *           example: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - inactive
 *           description: "The employee's status (active or inactive)."
 *           default: active
 *           example: active
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               description: "Street address of the employee."
 *               example: Vecna pot 1
 *             city:
 *               type: string
 *               description: "City where the employee lives."
 *               example: Ljubljana
 *             zipCode:
 *               type: integer
 *               description: "Zip code of the employee's address."
 *               example: 1000
 *             country:
 *               type: string
 *               description: "Country where the employee resides."
 *               example: Slovenia
 *           required:
 *             - street
 *             - city
 *             - zipCode
 *             - country
 *         __v:
 *           type: integer
 *           description: "Version key for document changes in MongoDB."
 *           readOnly: true
 *       required:
 *         - userName
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - phoneNumber
 *         - jobTitle
 *         - role
 *         - departmentId
 *         - hireDate
 *         - salary
 *         - status
 *     Authentication:
 *       type: object
 *       description: Authentication token of the employee.
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token
 *           example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTZiZWRmNDhmOTUzOTViMTlhNjc1ODgiLCJlbWFpbCI6InNpbW9uQGZ1bGxzdGFja3RyYWluaW5nLmNvbSIsIm5hbWUiOiJTaW1vbiBIb2xtZXMiLCJleHAiOjE0MzUwNDA0MTgsImlhdCI6MTQzNDQzNTYxOH0.GD7UrfnLk295rwvIrCikbkAKctFFoRCHotLYZwZpdlE
 *       required:
 *         - token
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
  role: {
    type: String,
    required: true,
    enum: ["admin", "employee"],
    default: "employee",
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
  walletAddress: {
    type: String,
    required: false,
    match: [/^0x[a-fA-F0-9]{40}$/, "Please provide a valid wallet address!"],
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: [true, "Status is required!"],
  },
  address: {
    street: {
      type: String,
      required: [true, "Street is required!"],
    },
    city: {
      type: String,
      required: [true, "City is required!"],
    },
    zipCode: {
      type: String,
      required: [true, "Zip code is required!"],
    },
    country: {
      type: String,
      required: [true, "Country is required!"],
    },
  },
  hash: {
    type: String,
    required: [true, "Hash is required"]
  },
  salt: {
    type: String,
    required: [true, "Salt is required"]
  }
});

employeeSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

employeeSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

employeeSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign(
    {
      userName: this.userName,
      role: this.role,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.JWT_SECRET
  );
};

const Employee = mongoose.model("Employe", employeeSchema, "Employee");
export default Employee;
