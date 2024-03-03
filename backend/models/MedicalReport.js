const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const petSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    petName: String,
    title: String,
    content: String,
    status: {
        type: Number,
        default: 1,
    },
    petImage: String,
})

petSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("MedicalReport", petSchema)