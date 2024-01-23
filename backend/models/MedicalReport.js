const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const medicalReportSchema = new mongoose.Schema({
    //petName, status, doctorId, petId, userId, title, content, image, userId
    petName: String,
    status: {
        type: Boolean,
        default: false,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    content: String,
    image: String,
})

medicalReportSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("MedicalReport", medicalReportSchema)