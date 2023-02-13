import mongoose from "mongoose";

const userLeaveConfirmationSchema = new mongoose.Schema({
    leaveConfirmation: {
        type: String,
        required: true,
    },
    userDetailsWithLeaveDetails: {
        type: Object,
        required: true,
    },
})

export default module.exports = mongoose.models.LeaveConfirmation || mongoose.model('LeaveConfirmation', userLeaveConfirmationSchema);