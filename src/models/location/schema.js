const { Schema } = require("mongoose");
const constants = require("../user/constants")

let schema =new Schema({
    city: {
        type: String,
        required: true 
    },
    state: {
        type: String,
        required: true 
    },
    country: {
        type: String,
        required: true 
    },
    zipcode: {
        type: String,
        required: true
    },
    landmark: {
        type: String
    },
    locality: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: constants.address_type.home,
        enum: constants.address_type.enum
    }
},
{
    collection: "locations",
    timestamps: {
        createdAt: "created",
        updatedAt: "modified"
    },
    autoCreate: true,
    versionKey: false
});

module.exports = { schema }