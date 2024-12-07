import mongoose from "mongoose";
import { types } from "sass";

const salarySchema = new mongoose.Schema({
    userName: { 
        type: String, 
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
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
        required: true,
        default: Date.now
    }
  });
  
const Salary = mongoose.model("Salary", salarySchema, "Salaries");
export default Salary