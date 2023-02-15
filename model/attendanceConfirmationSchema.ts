import mongoose from "mongoose";

const userAttendanceConfirmationSchema = new mongoose.Schema({
    attendanceConfirmation: {
        type: String,
        required: true,
    },
    userDetailsWithAttendanceDetails: {
        type: Object,
        required: true,
    },
})

export default module.exports = mongoose.models.AttendanceConfirmation || mongoose.model('AttendanceConfirmation', userAttendanceConfirmationSchema);