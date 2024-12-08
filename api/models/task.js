import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   Task:
 *    type: object
 *    properties:
 *     _id:
 *       type: string
 *       description: unique identifier
 *     userName:
 *       type: string
 *       description: "The employee's username."
 *       example: John
 *     description:
 *       type: string
 *       description: "Description of the task"
 *       example: Angular web app
 *     startDate:
 *       type: string
 *       format: date-time
 *       description: "Start date of task"
 *       example: 2024-12-25T17:43:00.000Z
 *     dueDate:
 *       type: string
 *       format: date-time
 *       description: "End date of task"
 *       example: 2025-01-10T17:43:00.000Z
 *     status:
 *       type: string
 *       enum:
 *         - Todo
 *         - In progress
 *         - Done
 *       description: "Status of task"
 *       default: Todo
 *       example: Todo
 *     updatedAt: 
 *       type: string
 *       format: date-time
 *       description: "Date of task update"
 *       example: 2024-12-10T17:43:00.000Z
 *     __v:
 *       type: integer
 *       description: "Version key for document changes in MongoDB."
 *       readOnly: true
 *    required:
 *      - userName
 *      - description
 *      - startDate
 *      - dueDate
 */
const taskSchema = new mongoose.Schema({
    userName: { 
        type: String,
        required: [true, "Username is required!"],
    },
    description: {
        type: String,
        required: [true, "Description is required!"],
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required!"],
    },
    dueDate: {
        type: Date,
        required: [true, "Due Date is required!"],
    },
    status: {
        type: String,
        enum: ["Todo", "In progress", "Done"],
        default: "Todo",
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model("Task", taskSchema, "Tasks");
export default Task;