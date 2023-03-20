import mongoose, { Schema } from "mongoose";

const holidaysSchema = new mongoose.Schema({
    selectedYear: {
        type: Number,
        required: true,
    },
    holidaysList:
        [new Schema({
            occasion: { type: String },
            eventDate: { type: String }
        }, { strict: false })
        ]
}, { strict: false });

export default module.exports = mongoose.models.Holidays || mongoose.model('Holidays', holidaysSchema);