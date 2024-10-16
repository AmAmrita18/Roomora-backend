const { Schema } = require("mongoose");
const constants = require("./constants");

let schema = new Schema({
    // _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: false,
        default: constants.status.active,
        enum: constants.status.enum
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    phone:{
        type: String,
        default: ''
    },
    profile_photo: {
        type: String,
        required: false
    },
    feedbacks: {
        type: [String],
        required: false,
        default: []
    },
    bookings: {
        type:[{
            type: Schema.Types.ObjectId,
            ref: 'Bookings'
        }]
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        default: null
    },
},
{
    collection: "users",
    timestamps: {
        createdAt: "created",
        updatedAt: "modified"
    },
    autoCreate: false,
    versionKey: false
});

schema.plugin(require('mongoose-bcrypt'));

module.exports = {
    schema
};