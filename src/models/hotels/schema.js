const { Schema } = require("mongoose");
const constants = require("./constants");
const feedback = require("./feedback");

let schema = new Schema({
    hotel_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        default: "No description provided"
    },
    hotel_type: {
        type: String,
        enum: constants.hotel_type.enum,
        required: true
    },
    facilities: {
        type: [String],
        required: true,
        default: []
    },
    rooms: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }],
        validate: {
            validator: function(rooms) {
                return rooms.length >= 1;
            },
            message: "A hotel must have at least one room."
        },
        required: true
    },
    photos: {
        type: [String], // Array of photo URLs
        validate: {
            validator: function(photos) {
                return photos.length >= 2 && photos.length <= 10;
            },
            message: "A hotel must have between 2 and 10 photos."
        },
        required: [true, "At least 2 photos are required."]
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    feedbacks: [feedback],
},
{
    collection: "hotels",
    timestamps: {
        createdAt: "created",
        updatedAt: "modified"
    },
    autoCreate: true,
    versionKey: false
});

module.exports = {
    schema
}
