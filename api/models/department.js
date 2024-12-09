import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   Department:
 *    type: object
 *    properties:
 *     name:
 *       type: string
 *       description: "Name of the department."
 *       example: "Accounting"
 *     description:
 *       type: string
 *       description: "Description of the department"
 *       example: "The accounting department manages financial records, ensures compliance with regulations, and oversees budgeting, payroll, and financial reporting."
 *     _id:
 *       type: string
 *       description: "Unique identifier for the department."
 *     __v:
 *       type: integer
 *       description: "Version key for document changes in MongoDB."
 *       readOnly: true
 *    required:
 *      - name
 */

const DepartmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name of department is required"],
    unique: true
  },
  description: {
    type: String,
  },
});

const deparment = mongoose.model("department", DepartmentSchema, "department");

export default deparment;
