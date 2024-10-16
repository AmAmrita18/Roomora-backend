const {Schema} = require("mongoose");
const constants = require("./constants");
const { required } = require("joi");

const schema = new Schema ({
    booking_id: Schema.Types.ObjectId,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotels",
        required: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    check_in: {
        type: Date,
        required: true
    },
    check_out: {
        type: Date,
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
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, 
{
    collection: "bookings",
    timestamps: {
        createdAt: "created",
        updatedAt: "modified"
    },
    autoCreate: false,
    versionKey: false
})

module.exports = { schema };