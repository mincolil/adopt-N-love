const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const adoptNotificationSchema = new mongoose.Schema({
    //userId, petName, status, weight, height, petImage, vaccine
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: String,
})

adoptNotificationSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("AdoptNotification", adoptNotificationSchema)