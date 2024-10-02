const Joi = require("joi");

const UserPassword = Joi.object({
    password: Joi.string().trim().min(8).max(32)
        .pattern(new RegExp('(?=.*[a-z])'))       // at least one lowercase letter
        .pattern(new RegExp('(?=.*[A-Z])'))       // at least one uppercase letter
        .pattern(new RegExp('(?=.*[0-9])'))       // at least one number
        .pattern(new RegExp('(?=.*[!@#$%^&*])'))  // at least one special character
        .label("Password").required(),
});

module.exports = {
    UserPassword
}