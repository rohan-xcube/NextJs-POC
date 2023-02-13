import mongoose from "mongoose";

const userLeaveSchema = new mongoose.Schema({
    fromDate: {
        type: String,
        required: true,
    },
    toDate: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    attachmentFileObject: {
        type: String,
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

export default module.exports = mongoose.models.Leaves || mongoose.model('Leaves', userLeaveSchema);