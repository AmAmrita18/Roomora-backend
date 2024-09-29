module.exports = {
    status: {
        active: "active",
        pending: "pending",
        disabled: "disabled",
        deleted: "deleted",
        enum: ["active", "pending", "disabled", "deleted"]
    },
    address_type: {
        work: "work",
        home: "home",
        other: "other",
        enum: ["work", "home", "other"]
    },
    payment_status: {
        completed: "completed",
        pending: "pending",
        enum: ["competed", "pending"]
    },
    booking_status: {
        active: "active",
        cancelled: "cancelled",
        enum: ["active", "cancelled"]
    },
    email_status: {
        sent: "sent",
        pending: "pending",
        enum: ["sent", "pending"]
    }
}