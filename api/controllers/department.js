import Department from "../models/department.js";
import mongoose from "mongoose";
import { joiInsertDepartmentSchema, joiUpdateDepartmentSchema } from "../utils/joivalidate.js"
/**
 * @openapi
 * paths:
 *   /departments:
 *     get:
 *       summary: Retrieve all departments.
 *       description: Retrieve **departments** that exsist.
 *       tags:
 *         - Department
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with departments array.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Department'
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
  try {
    const departments = await Department.find().exec();

    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
  try {
    const { error, value } = joiInsertDepartmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error.",
        details: error.details.map((detail) => detail.message)
      });
    }
    const { name, description } = value;

    const newDepartment = await Department.create({
      name,
      description,
    });

    res.status(201).json(newDepartment);
  } catch (err) {
    console.error("Error inserting department:", err);
    res.status(500).json({ message: err.message });
  }
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
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({
        message: "Valid query parameter 'id' is required",
      });
      return;
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
};

/**
 * @openapi
 * paths:
 *   /department/{id}:
 *     get:
 *       summary: Retrieve a department by its ID.
 *       description: Get the details of a **department** by its ID.
 *       tags:
 *         - Department
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: "ID of the department to retrieve."
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with the department details.
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
 *                 message: "Valid id required"
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

const findDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        message: "Valid query parameter 'id' is required",
      });
      return;
    }
    const { error, value } = joiUpdateDepartmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error.",
        details: error.details.map((detail) => detail.message)
      });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    department.name = value.name;
    department.description = value.description;

    const updatedDepartment = await department.save()
    res.status(200).json(updatedDepartment);
  } catch (err) {
    console.error("Error finding department:", err);
    res.status(500).json({ message: err.message });
  }
};

export default {
  getAllDepartments,
  insertDepartment,
  updateDepartment,
  deleteDepartment,
  findDepartmentById,
};
