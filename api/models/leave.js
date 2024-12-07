import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

const Leave = mongoose.model("Leave", leaveSchema, "Leaves");
export default Leave;