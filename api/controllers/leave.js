import Leave from "../models/leave.js";
import Employee from "../models/employee.js";

/**
 * @openapi
 * paths:
 *   /leaves:
 *     post:
 *       summary: Add new leave
 *       description: Adds a new leave request for an employee.
 *       tags:
 *         - Leave
 *       requestBody:
 *         description: Leave details to be added.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                   description: The unique username of the employee.
 *                   example: admin
 *                 reason:
 *                   type: string
 *                   description: Reason for the leave request.
 *                   example: Vacation
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   description: Start date of the leave.
 *                   example: 2024-11-26
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   description: End date of the leave.
 *                   example: 2024-12-10
 *               required:
 *                 - userName
 *                 - reason
 *                 - startDate
 *                 - endDate
 *       responses:
 *         '201':
 *           description: Leave added successfully.
 *           content:
 *             application/json:
 *               example:
 *                 message: Leave added successfully!
 *                 leave:
 *                   userName: admin
 *                   reason: Vacation
 *                   startDate: 2024-11-26
 *                   endDate: 2024-12-10
 *         '400':
 *           description: Bad request, missing or invalid parameters.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Missing required fields."
 *         '404':
 *           description: Employee not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Employee not found."
 *         '500':
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error occurred."
 */

const addLeave = async (req, res) => {
    try {
      const { userName, reason, startDate, endDate } = req.body;
      if ( !userName || userName == undefined || !userName.length < 0) {
        res.status(400).json({
          message: "Query parameter 'userName' is required",
        });
        return;
      }
      if ( !reason || reason == undefined || !reason.length < 0) {
        res.status(400).json({
          message: "Query parameter 'reason' is required",
        });
        return;
      }
      if ( !startDate || !endDate) {
        res.status(400).json({
          message: "Query parametera 'startDate and endDate' are required",
        });
        return;
      }
      const employee = await Employee.findOne({ userName });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found!" });
      }
  
      const leave = new Leave({ userName, reason, startDate, endDate });
      await leave.save();
  
      res.status(201).json({ message: "Leave added successfully!", leave });
    } catch (error) {
      res.status(500).json({ message: "Error adding leave", error: error.message });
    }
  };
  
/**
 * @openapi
 * paths:
 *   /leaves:
 *     get:
 *       summary: Retrieve all leaves.
 *       description: Retrieve **leave requests** of all employees.
 *       tags:
 *         - Leave
 *       responses:
 *         '200':
 *           description: Successful message, with leave data.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Leaves'
 *         '500':
 *           description: Internal Server Error, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error occurred."
 */

const getAllLeaves = async (req, res) => {
    try {
      const leaves = await Leave.find().populate("userName");
      res.status(200).json({ message: "Leaves fetched successfully!", leaves });
    } catch (error) {
      res.status(500).json({ message: "Error fetching leaves", error: error.message });
    }
};

/**
 * @openapi
 * paths:
 *   /leaves/{userName}:
 *     get:
 *       summary: Retrieve leave requests for a specific employee.
 *       description: Retrieve all leave requests associated with the specified employee by their `userName`.
 *       tags:
 *         - Leave
 *       parameters:
 *         - name: userName
 *           in: path
 *           description: The unique username of the employee.
 *           required: true
 *           schema:
 *             type: string
 *             example: "admin"
 *       responses:
 *         '200':
 *           description: <b>Succesful message</b>, with leaves of employee data.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Leave'
 *         '400':
 *           description: <b>Bad Request</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Query parameter 'userName' is required"
 *         '404':
 *           description: Employee <b>not found</b>.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Employee not found."
 *         '500':
 *           description: <b>Internal Server Error</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */
const getEmployeeLeaves = async (req, res) => {
    try {
      if (!req.params.userName) {
        res.status(400).json({
          message: "Query parameter 'userName' is required",
        });
        return;
      }
      const { userName } = req.params;
      const employee = await Employee.findOne({ userName });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found!" });
      }
  
      const leaves = await Leave.find({ userName });
      res.status(200).json({ message: "Employee leaves fetched successfully!", leaves });
    } catch (error) {
      res.status(500).json({ message: "Error fetching employee leaves", error: error.message });
    }
};
/**
 * @openapi
 * paths:
 *   /leaves/{leaveId}/status:
 *     put:
 *       summary: Update the status of a leave request.
 *       description: Update the status of a leave request using its ID. The status can only be updated to "Pending", "Approved", or "Rejected".
 *       tags:
 *         - Leave
 *       parameters:
 *         - name: leaveId
 *           in: path
 *           description: The unique ID of the leave request.
 *           required: true
 *           schema:
 *             type: string
 *             example: "64b91e76f3a48b001c0c9f47"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The new status of the leave request.
 *                   enum:
 *                     - Pending
 *                     - Approved
 *                     - Rejected
 *                   example: "Approved"
 *       responses:
 *         '200':
 *           description: <b>Succesful message</b>, with data.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Leave status updated successfully!"
 *                   leave:
 *                     $ref: '#/components/schemas/Leave'
 *         '400':
 *           description: <b>Invalid status value</b> or other bad request.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Invalid status value!"
 *         '404':
 *           description: Leave <b>not found</b>.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Leave not found!"
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */
export const updateLeaveStatus = async (req, res) => {
    try {
      const { leaveId } = req.params;
      const { status } = req.body;
  
      const validStatuses = ["Pending", "Approved", "Rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value!" });
      }
      const leave = await Leave.findByIdAndUpdate(
        leaveId,
        { status },
        { new: true }
      );
  
      if (!leave) {
        return res.status(404).json({ message: "Leave not found!" });
      }
  
      res.status(200).json({ message: "Leave status updated successfully!", leave });
    } catch (error) {
      res.status(500).json({ message: "Error updating leave status", error: error.message });
    }
};

/**
 * @openapi
 * paths:
 *   /leaves/{leaveId}:
 *     delete:
 *       summary: Delete a leave request.
 *       description: Delete a leave request using its unique ID.
 *       tags:
 *         - Leave
 *       parameters:
 *         - name: leaveId
 *           in: path
 *           description: The unique ID of the leave request.
 *           required: true
 *           schema:
 *             type: string
 *             example: "64b91e76f3a48b001c0c9f47"
 *       responses:
 *         '200':
 *           description: Leave <b>deleted successfully</b>.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Leave deleted successfully!"
 *                   deletedLeave:
 *                     $ref: '#/components/schemas/Leave'
 *         '400':
 *           description: Leave ID is required.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Leave ID is required"
 *         '404':
 *           description: Leave not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Leave not found"
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorMessage'
 *               example:
 *                 message: "Unknown error"
 */

const deleteLeave = async (req, res) => {
  try {
      const { leaveId } = req.params;

      if (!leaveId) {
          return res.status(400).json({ message: "Leave ID is required!" });
      }

      const deletedLeave = await Leave.findByIdAndDelete(leaveId);

      if (!deletedLeave) {
          return res.status(404).json({ message: "Leave not found!" });
      }

      res.status(200).json({
          message: "Leave deleted successfully!",
          deletedLeave
      });
  } catch (error) {
      res.status(500).json({ message: "Error deleting leave", error: error.message });
  }
};
export default {
    addLeave,
    getAllLeaves,
    getEmployeeLeaves,
    updateLeaveStatus,
    deleteLeave
};