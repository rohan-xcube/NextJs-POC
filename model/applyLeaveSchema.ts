import mongoose from "mongoose";

const schema = mongoose.Schema

const userLeaveSchema = new mongoose.Schema({
    fromDate: {
        type: Number,
        required: true,
    },
    toDate: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    attachmentFileObject: {
        type: String,
    },
    userId: {
        type: schema.Types.ObjectId,
        required: true,
    },
    leaveConfirmation: {
        type: Boolean,
        required: true,
    },
    requestPending: {
        type: Boolean,
        required: true,
    }
})

export default module.exports = mongoose.models.Leaves || mongoose.model('Leaves', userLeaveSchema);