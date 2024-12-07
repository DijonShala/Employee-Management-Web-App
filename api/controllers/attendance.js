import Attendance from "../models/attendance.js";
import mongoose from "mongoose";

/**
 * @openapi
 * paths:
 *   /attendanceByUsername/{username}:
 *     get:
 *       summary: Retrieve employee's attendance by username.
 *       description: Retrieve **attendances** by employee username.
 *       tags:
 *         - Attendance
 *       parameters:
 *         - name: username
 *           in: path
 *           required: true
 *           description: <b>username</b> of the employee
 *           schema:
 *             type: string
 *             minLength: 0
 *             maxLength: 100
 *           example: admin
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with attendances array.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Attendance'
 *         '400':
 *           description: <b>Bad Request</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Query parameter 'username' is required"
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const attendanceByUsername = async (req, res) => {
  try {
    if (
      !req.params.username ||
      req.params.username == undefined ||
      !req.params.username.length < 0
    ) {
      res.status(400).json({
        message: "Query parameter 'username' is required",
      });
      return;
    }
    const attendances = await Attendance.find({
      userName: req.params.username,
    }).exec();

    res.status(200).json(attendances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * paths:
 *   /clockIn/{username}:
 *     post:
 *       summary: Clockin employee.
 *       description: Insert attendace with current date-time.
 *       tags:
 *         - Attendance
 *       parameters:
 *         - name: username
 *           in: path
 *           required: true
 *           description: <b>username</b> of the employee
 *           schema:
 *             type: string
 *             minLength: 0
 *             maxLength: 100
 *           example: admin
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with created attendance.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Attendance'
 *         '400':
 *           description: <b>Bad Request</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Query parameter 'username' is required"
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const clockIn = async (req, res) => {
  try {
    if (
      !req.params.username ||
      req.params.username == undefined ||
      !req.params.username.length < 0
    ) {
      res.status(400).json({
        message: "Query parameter 'username' is required",
      });
      return;
    }

    const a = await Attendance.findOne({
      userName: req.params.username,
      clock_out_time: null,
      status: "present",
    });

    if (a) {
      res.status(400).json({
        message: "Employee must chek-out first.",
      });
      return;
    }

    const attendance = await Attendance.create({
      userName: req.params.username,
      clock_in_time: new Date(),
      clock_out_time: null,
      status: "present",
    });

    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * paths:
 *   /clockOut/{username}:
 *     post:
 *       summary: Clockout employee.
 *       description: Finish attendace with current date-time.
 *       tags:
 *         - Attendance
 *       parameters:
 *         - name: username
 *           in: path
 *           required: true
 *           description: <b>username</b> of the employee
 *           schema:
 *             type: string
 *             minLength: 0
 *             maxLength: 100
 *           example: admin
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with updated attendance.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Attendance'
 *         '400':
 *           description: <b>Bad Request</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Query parameter 'username' is required"
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const clockOut = async (req, res) => {
  try {
    if (
      !req.params.username ||
      req.params.username == undefined ||
      !req.params.username.length < 0
    ) {
      res.status(400).json({
        message: "Query parameter 'username' is required",
      });
      return;
    }

    const attendace = await Attendance.findOne({
      userName: req.params.username,
      clock_out_time: null,
      status: "present",
    });

    if (!attendace) {
      res.status(400).json({
        message: "Employee must chek-in first.",
      });
      return;
    }

    attendace.clock_out_time = new Date();
    attendace.status = "completed";

    const updatedAttendance = await attendace.save();

    res.status(200).json(updatedAttendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * paths:
 *   /attendance/{_id}:
 *     delete:
 *       summary: Delete attendance.
 *       description: Delete **attendance**.
 *       tags:
 *         - Attendance
 *       parameters:
 *         - name: _id
 *           in: path
 *           required: true
 *           description: <b>_id</b> of the attendance
 *           schema:
 *             type: string
 *             minLength: 0
 *             maxLength: 100
 *           example: "abc123..."
 *       responses:
 *         '200':
 *           description: <b>OK</b>, with Attendance successfully deleted.
 *           content:
 *             application/json:
 *               example:
 *                  message: "Attendance successfully deleted."
 *         '400':
 *           description: <b>Bad Request</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Query parameter '_id' is required"
 *         '404':
 *           description: <b>Not Found</b>, attendance not found.
 *           content:
 *              application/json:
 *               example:
 *                 message: "Attendance with given '_id' parameter does not exit."
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const attendaceDeleteOne = async (req, res) => {
  try {
    if (!req.params._id || !mongoose.Types.ObjectId.isValid(req.params._id)) {
      res.status(400).json({
        message: "Valid query parameter '_id' is required",
      });
      return;
    }

    const attendace = await Attendance.findOne({
      _id: req.params._id,
    });

    if (!attendace) {
      res.status(400).json({
        message: "Attendance with given '_id' parameter does not exit.",
      });
      return;
    }

    await attendace.deleteOne();

    res.status(200).json({ message: "Attendance successfully deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  attendanceByUsername,
  clockIn,
  clockOut,
  attendaceDeleteOne,
};
