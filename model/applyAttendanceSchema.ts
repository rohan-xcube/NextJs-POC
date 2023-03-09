import mongoose from "mongoose";

const schema = mongoose.Schema

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
        type: Number,
        required: true,
    },
    toDate: {
        type: Number,
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
    userId: {
        type: schema.Types.ObjectId,
        required: true,
    },
    attendanceConfirmation: {
        type: Boolean,
        required: true,
    },
    requestPending: {
        type: Boolean,
        required: true,
    }
}, {timestamps: true}
)

export default module.exports = mongoose.models.Attendances || mongoose.model('Attendances', userAttendanceSchema);