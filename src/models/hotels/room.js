const { Schema } = require("mongoose");

let room = new Schema({
    roomType: {
        type: String,
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
        type: String,
        min: 0,
        max: 70,
    },
    room_facilities: {
        type: [String],
        required: true,
        default: []
    },


}, { _id: false });

module.exports = { room }