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
    //tiem phong
    vaccine: {
        type: Boolean,
        default: false,
    },
    //triet san
    sterilization: {
        type: Boolean,
        default: false,
    },
    //tiêm dại
    rabies: {
        type: Boolean,
        default: false,
    },
    //vệ sinh đúng chỗ
    toilet: {
        type: Boolean,
        default: false,
    },
    //thân thiện với trẻ em
    childFriendly: {
        type: Boolean,
        default: false,
    },
    //thân thiện với thú cưng khác
    petFriendly: {
        type: Boolean,
        default: false,
    },
})

adoptSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("AdoptPet", adoptSchema)
