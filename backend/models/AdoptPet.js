const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const adoptSchema = new mongoose.Schema({
    //userId, petName, status, weight, height, petImage, vaccine
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    petName: String,
    status: {
        type: Boolean,
        default: false,
    },
    age: Number,
    species: String,
    weight: Number,
    height: Number,
    petImage: String,
    vaccine: {
        type: Boolean,
        default: false,
    }
})

adoptSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("AdoptPet", adoptSchema)
