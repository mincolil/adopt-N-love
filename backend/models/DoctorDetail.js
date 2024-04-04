const mongooose = require('mongoose')

const doctorDetailSchema = new mongooose.Schema(
    {
        doctorId: {
            type: mongooose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        description: {
            type: String,
            default: true,
        },
        experience: {
            type: String,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongooose.model('doctorDetail', doctorDetailSchema)