import mongoose from "mongoose";

const userAttendanceSchema = new mongoose.Schema({
    requestType: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    fromDate: {
        type: String,
        required: true,
    },
    toDate: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: false
    },
})

export default module.exports = mongoose.models.Attendances || mongoose.model('Attendances', userAttendanceSchema);