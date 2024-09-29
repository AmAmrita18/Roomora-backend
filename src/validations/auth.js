const Joi = require("joi");

const UserRegisterSchema = Joi.object({
    name: Joi.string().trim().min(1).max(50).label("Name").required(),
    password: Joi.string().trim().min(8).max(32)
        .pattern(new RegExp('(?=.*[a-z])'))       // at least one lowercase letter
        .pattern(new RegExp('(?=.*[A-Z])'))       // at least one uppercase letter
        .pattern(new RegExp('(?=.*[0-9])'))       // at least one number
        .pattern(new RegExp('(?=.*[!@#$%^&*])'))  // at least one special character
        .label("Password").required(),
	email: Joi.string().lowercase().trim().email().label("Email").required(),
});

module.exports = {
    UserRegisterSchema
}