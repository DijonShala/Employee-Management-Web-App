import Department from "../models/department.js";
import mongoose from "mongoose";
import Employee from "../models/employee.js";
import {
  joiInsertDepartmentSchema,
  joiUpdateDepartmentSchema,
} from "../utils/joivalidate.js";
/**
 * @openapi
 * paths:
 *   /departments:
 *     get:
 *       summary: Retrieve all departments.
 *       description: Retrieve **departments** that exsist.
 *       tags:
 *         - Department
 *       security:
 *        - jwt: []
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with departments array.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Department'
 *         '401':
 *            description: <b>Unauthorized</b>, with error message.
 *            content:
 *              application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               examples:
 *                no token provided:
 *                 value:
 *                  message: No authorization token was found.
 *                user not found:
 *                 value:
 *                  message: User not found.
 *         '403':
 *          description: <b>Forbidden</b>, with error message.
 *          content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *             message: Not authorized to access this info.
 *         '404':
 *          description: <b>Not found</b>, with error message.
 *          content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *             message: Departments not founs.
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const getAllDepartments = async (req, res) => {
  getEmployee(req, res, async (req, res, emp) => {
    try {
      if(emp.role != "admin"){
        return res.status(403).json({
          message: "Not authorized to access this info.",
        });
      }
      const departments = await Department.find().exec();

      res.status(200).json(departments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

/**
 * @openapi
 * paths:
 *   /department:
 *     post:
 *       summary: Insert a new department.
 *       description: Add a new **department** to the database.
 *       tags:
 *         - Department
 *       security:
 *        - jwt: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: "Name of the department."
 *                   example: "Accounting"
 *                 description:
 *                   type: string
 *                   description: "Description of the department."
 *                   example: "The accounting department manages financial records, ensures compliance with regulations, and oversees budgeting, payroll, and financial reporting."
 *       responses:
 *         '201':
 *           description: <b>Created</b>, with the inserted department.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Department'
 *         '400':
 *           description: <b>Bad Request</b>, with validation error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Validation error: 'name' is required"
 *         '401':
 *            description: <b>Unauthorized</b>, with error message.
 *            content:
 *              application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               examples:
 *                no token provided:
 *                 value:
 *                  message: No authorization token was found.
 *                user not found:
 *                 value:
 *                  message: User not found.
 *         '403':
 *          description: <b>Forbidden</b>, with error message.
 *          content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *             message: Not authorized to access this info.
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const insertDepartment = async (req, res) => {
  getEmployee(req, res, async (req, res, emp) => {
    try {
      const { error, value } = joiInsertDepartmentSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          message: "Validation error.",
          details: error.details.map((detail) => detail.message)
        });
      }
      const { name, description } = value;

      if(emp.role != "admin"){
        return res.status(403).json({
          message: "Not authorized to add deoartment.",
        });
      }
      const newDepartment = await Department.create({
        name,
        description,
      });

      res.status(201).json(newDepartment);
    } catch (err) {
      console.error("Error inserting department:", err);
      res.status(500).json({ message: err.message });
    }
  });
};

/**
 * @openapi
 * paths:
 *   /department/{id}:
 *     put:
 *       summary: Update an existing department.
 *       description: Update details of a **department** in the database.
 *       tags:
 *         - Department
 *       security:
 *        - jwt: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: "ID of the department to be updated."
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: "Name of the department."
 *                   example: "Accounting"
 *                 description:
 *                   type: string
 *                   description: "Description of the department."
 *                   example: "The accounting department manages financial records, ensures compliance with regulations, and oversees budgeting, payroll, and financial reporting."
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with updated department.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Department'
 *         '400':
 *           description: <b>Bad Request</b>, with validation error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Validation error: 'name' is required"
 *         '401':
 *            description: <b>Unauthorized</b>, with error message.
 *            content:
 *              application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               examples:
 *                no token provided:
 *                 value:
 *                  message: No authorization token was found.
 *                user not found:
 *                 value:
 *                  message: User not found.
 *         '403':
 *          description: <b>Forbidden</b>, with error message.
 *          content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *             message: Not authorized to access this info.
 *         '404':
 *           description: <b>Not Found</b>, department with given ID does not exist.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Department not found"
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const updateDepartment = async (req, res) => {
  getEmployee(req, res, async (req, res, emp) => {
    try {
      // Validate required fields
      if (!req.body.name) {
        return res
          .status(400)
          .json({ message: "Query parameter 'name' is required" });
      }

      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({
          message: "Valid query parameter 'id' is required",
        });
        return;
      }
      if(emp.role != "admin"){
        return res.status(403).json({
          message: "Not authorized to update department.",
        });
      }
      const department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      department.name = req.body.name;
      department.description = req.body.description;

      const updatedDepartment = await department.save();

      res.status(200).json(updatedDepartment);
    } catch (err) {
      console.error("Error updating department:", err);
      res.status(500).json({ message: err.message });
    }
  });
};

/**
 * @openapi
 * paths:
 *   /department/{id}:
 *     delete:
 *       summary: Delete an existing department.
 *       description: Delete a **department** from the database.
 *       tags:
 *         - Department
 *       security:
 *        - jwt: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: "ID of the department to be deleted."
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with a success message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessMessage'
 *               example:
 *                 message: "Department deleted successfully"
 *         '400':
 *           description: <b>Bad Request</b>, with validation error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Valid id required"
 *         '401':
 *            description: <b>Unauthorized</b>, with error message.
 *            content:
 *              application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               examples:
 *                no token provided:
 *                 value:
 *                  message: No authorization token was found.
 *                user not found:
 *                 value:
 *                  message: User not found.
 *         '403':
 *          description: <b>Forbidden</b>, with error message.
 *          content:
 *           application/json:
 *            schema:
 *             $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *             message: Not authorized to access this info.
 *         '404':
 *           description: <b>Not Found</b>, department with the given ID does not exist.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Department not found"
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const deleteDepartment = async (req, res) => {
  getEmployee(req, res, async (req, res, emp) => {
    try {
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({
          message: "Valid query parameter 'id' is required",
        });
        return;
      }
      if(emp.role != "admin"){
        return res.status(403).json({
          message: "Not authorized to delete department.",
        });
      }
      const department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      await department.deleteOne();

      res.status(200).json({ message: "Department deleted successfully" });
    } catch (err) {
      console.error("Error deleting department:", err);
      res.status(500).json({ message: err.message });
    }
  });
};

/**
 * @openapi
 * paths:
 *   /department/{depname}:
 *     get:
 *       summary: Retrieve employees from a specific department
 *       description: Fetch a list of all employees in a specified department. Only admin users are authorized to access this endpoint.
 *       tags:
 *         - Department
 *       security:
 *         - jwt: []
 *       parameters:
 *         - in: path
 *           name: depname
 *           required: true
 *           description: The name of the department to fetch employees from.
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: A list of employees in the specified department.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Employees in the {departmentName} department."
 *                   employees:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         userName:
 *                           type: string
 *                           example: "admin1"
 *                         firstName:
 *                           type: string
 *                           example: "admin"
 *                         lastName:
 *                           type: string
 *                           example: "admin"
 *                         email:
 *                           type: string
 *                           example: "admin@mail.com"
 *                         phoneNumber:
 *                           type: string
 *                           example: "123-456-7890"
 *                         jobTitle:
 *                           type: string
 *                           example: "Software Engineer"
 *                         departmentId:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109ca"
 *         '401':
 *           description: <b>Unauthorized</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               examples:
 *                 no token provided:
 *                   value:
 *                     message: No authorization token was found.
 *                 user not found:
 *                   value:
 *                     message: User not found.
 *         403:
 *           description: User is not authorized to access this resource.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Not authorized to delete department."
 *         404:
 *           description: Department not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Not found"
 *         500:
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */
const findEmployeeAtDepartment = async (req, res) => {
  getEmployee(req, res, async (req, res, emp) => {
    try {
      const departmentName = req.params.depname;
      if(emp.role != "admin"){
        return res.status(403).json({
          message: "Not authorized to delete department.",
        });
      }
      const department = await Department.findOne({ name: departmentName }).exec();
      if (!department) {
        return res.status(404).json({ message: "Department not found!" });
      }

      const employees = await Employee.find({ departmentId: department._id }).exec();

      res.status(200).json({
        message: `Employees in the ${departmentName} department.`,
        employees,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching employees.",
        error: error.message,
      });
    }
  });
};


const getEmployee = async (req, res, cbResult) => {
  if (req.auth?.userName) {
    try {
      let employee = await Employee.findOne({ userName: req.auth.userName }).exec();
      if (!employee) res.status(401).json({ message: "Not authenticated." });
      else cbResult(req, res, employee);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default {
  getAllDepartments,
  insertDepartment,
  updateDepartment,
  deleteDepartment,
  findEmployeeAtDepartment
};
