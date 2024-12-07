import Leave from "../models/leave.js";
import Employee from "../models/employee.js";

const addLeave = async (req, res) => {
    try {
      const { userName, reason, startDate, endDate } = req.body;
  
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

const getAllLeaves = async (req, res) => {
    try {
      // Populate the related employee data
      const leaves = await Leave.find().populate("userName");
      res.status(200).json({ message: "Leaves fetched successfully!", leaves });
    } catch (error) {
      res.status(500).json({ message: "Error fetching leaves", error: error.message });
    }
};

const getEmployeeLeaves = async (req, res) => {
    try {
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