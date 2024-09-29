const { Schema } = require("mongoose");

let feedback = new Schema({
    feedback_id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel_id: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    feedbackText: {
        type: String,
        required: true,
        maxlength: 500
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
},
{
    timestamps: {
        createdAt: "created",
        updatedAt: "modified"
    },
});

module.exports = { feedback };