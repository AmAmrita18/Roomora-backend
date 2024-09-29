const _ = require("lodash");
const BaseClass = require("./base")
const Validation = require("../validations");


class Auth extends BaseClass {
    constructor(ctx, next){
        super(ctx, next);

        this._beforeMethods = {
            
        }
    }
    async register(){
        let {value, error} = Validation.Auth.UserRegisterSchema.validate(this.ctx.request.body);
        if(error){
            let errorMessage = _.size(error.details) > 0 ? error.details[0].message: null;
            this.throwError("201", errorMessage);
        }

        let user = await this.models.User.findOne({email: value.email});
        if(user){
            this.throwError("201", "User already exist");
        }
        try {
            user = new this.models.User({
                email: value.email,
                password: value.password,
                name: value.name
            })

            console.log('User registered successfully')
        } catch (err) {
            this.throwError("301")
        }

        try {
            await user.save()
        } catch (err) {
            this.throwError("301")
        }

        this.ctx.body = ({
            success: true,
            message: "OLA!!!"
        })
    }

    async login(){
        const { email, password } = this.ctx.request.body;
        console.log({req: this.ctx.request.body})
        let user = await this.models.User.findOne({email: email});
        if(!user){
            this.throwError("404", "User not found");
        }

        const isPasswordValid = await user.verifyPassword(password);

        if (!isPasswordValid) {
            this.throwError("201", "Invalid password");
            return;
        }

        this.ctx.body = {
            success: true,
            message: "Login successful",
            user: user
        };
    }
}
module.exports = Auth;