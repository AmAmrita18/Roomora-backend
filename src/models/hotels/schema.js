const { Schema } = require("mongoose");
const constants = require("./constants");
const location = require("./location");
const room = require("./room");
const feedback = require("./feedback");

let schema = new Schema({
    hotel_id: {
        type: Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    hotel_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    location: {
        type: location,
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        default: "No description provided"
    },
    property_type: {
        type: String,
        enum: constants.property_type.enum,
        required: true
    },
    facilities: {
        type: [String],
        required: true,
        default: []
    },
    rooms: [room],
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
