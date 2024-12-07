import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   Attendance:
 *    type: object
 *    properties:
 *     userName:
 *       type: string
 *       description: "The employee's username."
 *       example: admin
 *     clock_in_time:
 *       type: string
 *       format: date-time
 *       description: "Clock in time."
 *     clock_out_time:
 *       type: string
 *       format: date-time
 *       description: "Clock out time."
 *     status:
 *       enum:
 *         - present
 *         - completed
 *       type: string
 *       description: "Status of clockin."
 *       example: Present
 *     _id:
 *      type: string
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
  },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema, "Attendance");

export default Attendance;
