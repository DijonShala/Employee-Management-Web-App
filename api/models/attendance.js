import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   Attendance:
 *    type: object
 *    properties:
 *     _id:
 *       type: string
 *       description: unique identifier
 *     userName:
 *       type: string
 *       description: "The employee's username."
 *       example: admin
 *     clock_in_time:
 *       type: string
 *       format: date-time
 *       description: "Clock in time."
 *       example: 2024-12-25T08:15:00.000Z
 *     clock_out_time:
 *       type: string
 *       format: date-time
 *       description: "Clock out time."
 *       example: 2024-12-25T16:15:00.000Z
 *     status:
 *       enum:
 *         - present
 *         - completed
 *       type: string
 *       description: "Status of clockin."
 *       example: Present
 *     __v:
 *       type: integer
 *       description: "Version key for document changes in MongoDB."
 *       readOnly: true
 *    required:
 *      - userName
 */

const AttendanceSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Username name is required!"],
  },
  clock_in_time: {
    type: Date,
  },
  clock_out_time: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["present", "completed"],
    default: "present"
  },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema, "Attendance");

export default Attendance;
