import Task from "../models/task.js"
import Employee from "../models/employee.js"
import { joiAddTaskSchema, joiUpdateTaskStatusSchema } from "../utils/joivalidate.js"

/**
 * @openapi
 * paths:
 *   /tasks:
 *     post:
 *       summary: Add a new task.
 *       description: Creates a new task for an employee, including required information about the task.
 *       tags:
 *         - Task
 *       security:
 *        - jwt: []
 *       requestBody:
 *         description: Task details to be added.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                   description: "The unique username of the employee."
 *                   example: "admin"
 *                 description:
 *                   type: string
 *                   description: "A brief description of the task."
 *                   example: "Complete the monthly report"
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   description: "The start date of the task."
 *                   example: "2024-11-01"
 *                 dueDate:
 *                   type: string
 *                   format: date
 *                   description: "The due date for task completion."
 *                   example: "2024-11-15"
 *       responses:
 *         '201':
 *           description: <b>Successfully</b> added the task.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Task'
 *               example:
 *                 message: "Task added successfully!"
 *                 task:
 *                   userName: "admin"
 *                   description: "Complete the monthly report"
 *                   startDate: "2024-11-01"
 *                   dueDate: "2024-11-15"
 *         '400':
 *           description: Bad request due to <b>missing required fields</b>.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Missing required fields!"
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
 *           description: Employee not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Employee not found!"
 *         '500':
 *           description: Internal server error while adding the task.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Error adding task"
 */
const addTask = async (req, res) => {
    getEmployee(req, res, async (req, res, emp) => {
        try {
            const { error, value } = joiAddTaskSchema.validate(req.body, { abortEarly: false });

            if (error) {
                return res.status(400).json({
                    message: "Validation error.",
                    details: error.details.map((detail) => detail.message)
                });
            }
            if(emp.role != "admin"){
                return res.status(403).json({
                  message: "Not authorized to make changes.",
                });
              }
            const { userName, description, startDate, dueDate } = value;

            const employee = await Employee.findOne({ userName });
            if (!employee) {
                return res.status(404).json({ message: "Employee not found!" });
            }

            const task = new Task({ userName, description, startDate, dueDate });
            await task.save();

            res.status(201).json({ message: "Task added successfully!", task });
        } catch (error) {
            res.status(500).json({ message: "Error adding task", error: error.message });
        }
    });
};

/**
 * @openapi
 * paths:
 *   /tasks:
 *     get:
 *       summary: Retrieve all tasks.
 *       description: Fetches a list of all tasks from the database.
 *       tags:
 *         - Task
 *       security:
 *        - jwt: []
 *       responses:
 *         '200':
 *           description: Successfully retrieved all tasks.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Tasks fetched successfully!"
 *                   tasks:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Task'
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
 *           description: Internal server error while fetching tasks.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message:  "Error fetching tasks"
 */
const getAllTasks = async (req, res) => {
    getEmployee(req, res, async (req, res, emp) => {
        try {
            if(emp.role != "admin"){
                return res.status(403).json({
                  message: "Not authorized to access this info.",
                });
              }
            const tasks = await Task.find();
            res.status(200).json({ message: "Tasks fetched successfully!", tasks });
        } catch (error) {
            res.status(500).json({ message: "Error fetching tasks", error: error.message });
        }
    });
};

/**
 * @openapi
 * paths:
 *   /tasks/{userName}:
 *     get:
 *       summary: Retrieve tasks for a specific employee.
 *       description: Fetch all tasks associated with a specific employee's username.
 *       tags:
 *         - Task
 *       security:
 *        - jwt: []
 *       parameters:
 *         - name: userName
 *           in: path
 *           description: The unique username of the employee.
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successfully retrieved tasks for the specified employee.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Employee tasks fetched successfully!"
 *                   tasks:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Task'
 *         '404':
 *           description: Employee not found or no tasks found for the specified employee.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Employee not found!"
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
 *           description: Internal server error while fetching employee tasks.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Error fetching employee tasks"
 */
const getTasksByUserName = async (req, res) => {
    getEmployee(req, res, async (req, res, emp) => {
        try {
            const { userName } = req.params;
            if(emp.role != "admin" && emp.userName != userName){
                return res.status(403).json({
                  message: "Not authorized to access this info.",
                });
              }
            const employee = await Employee.findOne({ userName });
            if (!employee) {
                return res.status(404).json({ message: "Employee not found!" });
            }
            const tasks = await Task.find({ userName });
            if (!tasks.length) {
                return res.status(404).json({ message: "No tasks found for the specified employee!" });
            }
            res.status(200).json({ message: "Employee tasks fetched successfully!", tasks });
        } catch (error) {
            res.status(500).json({ message: "Error fetching employee tasks", error: error.message });
        }
    });
};

/**
 * @openapi
 * paths:
 *   /tasks/{taskId}/status:
 *     put:
 *       summary: Update the status of a task.
 *       description: Update the status of a specific task. Valid statuses are "Todo", "In progress", and "Done".
 *       tags:
 *         - Task
 *       security:
 *        - jwt: []
 *       parameters:
 *         - name: taskId
 *           in: path
 *           description: The unique identifier of the task to be updated.
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The new status of the task.
 *                   enum: [Todo, In progress, Done]
 *                   example: "In progress"
 *       responses:
 *         '200':
 *           description: Task status updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Task status updated successfully!"
 *                   task:
 *                     $ref: '#/components/schemas/Task'
 *         '400':
 *           description: Invalid status value provided.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Invalid status value!"
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
 *           description: Task not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Task not found!"
 *         '500':
 *           description: Internal server error while updating the task status.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Error updating task status"
 */
const updateTaskStatus = async (req, res) => {

        try {
            const { taskId } = req.params;

            const { error, value } = joiUpdateTaskStatusSchema.validate(req.body, { abortEarly: false });
            if (error) {
                return res.status(400).json({
                    message: "Validation error.",
                    details: error.details.map((detail) => detail.message)
                });
            }
            const { status } = value;

            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found!" });
            }
            if (task.userName !== req.auth?.userName) {
                return res.status(403).json({ message: "Access denied. You are not authorized to update this task." });
            }
            
            const updatetask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

            res.status(200).json({ message: "Task status updated successfully!", updatetask });
        } catch (error) {
            res.status(500).json({ message: "Error updating task status", error: error.message });
        }
};

/**
 * @openapi
 * paths:
 *   /tasks/{taskId}:
 *     delete:
 *       summary: Delete a task by ID
 *       description: Deletes a specific task identified by its unique ID.
 *       tags:
 *         - Task
 *       security:
 *        - jwt: []
 *       parameters:
 *         - name: taskId
 *           in: path
 *           description: The unique identifier of the task to be deleted.
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Task successfully deleted.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Task deleted successfully!"
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
 *           description: Task not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Task not found!"
 *         '500':
 *           description: Internal server error while deleting the task.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Error deleting task"
 */
const deleteTask = async (req, res) => {
    getEmployee(req, res, async (req, res, emp) => {
        try {
            if(emp.role != "admin"){
                return res.status(403).json({
                  message: "Not authorized to make changes.",
                });
              }
            const { taskId } = req.params;

            const task = await Task.findByIdAndDelete(taskId);

            if (!task) {
                return res.status(404).json({ message: "Task not found!" });
            }

            res.status(200).json({ message: "Task deleted successfully!" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting task", error: error.message });
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
    addTask,
    getAllTasks,
    getTasksByUserName,
    updateTaskStatus,
    deleteTask
};