const { Schema } = require("mongoose");

let schema = new Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    profile_photo: {
        type: String,
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
});

module.exports = {schema}