const { Schema } = require("mongoose");

let location =new Schema({
    locationName: {
        type: String,
        required: true
    },
    lat: { 
        type: Number, 
        required: true 
    },
    long: { 
        type: Number, 
        required: true 
    }
}, {_id: false});

module.exports = { location }