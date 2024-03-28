const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const petSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    petName: String,
    rank: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: false,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    color: String,
    weight: Number,
    height: Number,
    breed: String,
    age: Number,
    petImage: String,
    facebook: String,
    adoptDescription: String,
    forAdoption: {
        type: Boolean,
        default: false,
    },
})

petSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("Pet", petSchema)