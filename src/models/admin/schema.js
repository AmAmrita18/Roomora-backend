const { Schema } = require("mongoose");
const constants = require("./constants");
const { address } = require("../user/address");

let schema = new Schema({
    // _id: Schema.Types.ObjectId,  // -> document must have an _id before saving
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
    // status: {
    //     type: String,
    //     required: true,
    //     default: constants.status.pending,
    //     enum: constants.status.enum
    // },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    profile_photo: {
        type: String,
        required: false
    },
    address_list: {
        type: [address],
        max: 5
    },
    type: {
        type: String,
        enum: constants.admin_type.enum,
        default: constants.admin_type.admin,
        required: true
    },
    hotels: [String]
},
{
    collection: "admins",
    timestamps: {
        createdAt: "created",
        updatedAt: "modified"
    },
    autoCreate: false,
    versionKey: false
});

schema.plugin(require('mongoose-bcrypt'))

module.exports = {
    schema
}