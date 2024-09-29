const {Schema} = require("mongoose");
const constants = require("./constants")

const booking = new Schema ({
    booking_id: Schema.Types.ObjectId,
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hotel_id: {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    booking_status: {
        type: String,
        enum: constants.booking_status.enum,
        default: constants.booking_status.active,
        required: true
    },
    payment_status: {
        type: String,
        enum: constants.payment_status.enum,
        default: constants.payment_status.pending,
        required: true
    },
    email_status: {
        type: String,
        enum: constants.email_status.enum,
        default: constants.email_status.pending,
        required: true
    }
}, 
{
    timestamps: {
        createdAt: "created",
        updatedAt: "modified"
    },
})

module.exports = { booking };