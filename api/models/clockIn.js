import mongoose from "mongoose";

const clockInSchema = mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Employee ID is required!"],
  },
  clockInTime: {
    type: Date,
    default: Date.now,
    required: [true, "Clock-in time is required!"],
  },
  clockOutTime: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
});

const clockIn = mongoose.model("clockIn", clockInSchema, "clockIns");

export default clockIn;
