const { Schema } = require("mongoose");
const constants = require("./constants");

let schema = new Schema({
    roomType: {
        type: String,
        enum: constants.room_type.enum,
        required: true
    },
    total_rooms: {
        type: Number,
        required: true,
        min: 1
    },
    available_rooms: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        min: 0,
        max: 70,
        default: 0
    },
    room_facilities: {
        type: [String],
        default: []
    },


},
{
    collection: "rooms",
    timestamps: {
        createdAt: "created",
        updatedAt: "modified"
    },
    autoCreate: true,
    versionKey: false
});

module.exports = { schema }