const _ = require("lodash");
const BaseClass = require("./base")
const Validation = require("../validations");
const jwt = require("jsonwebtoken")


class Auth extends BaseClass {
    constructor(ctx, next){
        super(ctx, next);
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
        } catch (err) {
            this.throwError("301")
        }
        try {
            await user.save();
        } catch (err) {
            console.log(err)
            this.throwError("301")
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },  
            this.config.JWT_SECRET,   
            { expiresIn: '1d'}   
        )

        this.ctx.body = ({
            success: true,
            message: "User registered successfully",
            user: user,
            access_token: token
        })
    }

    async login(){
        const { email, password } = this.ctx.request.body;
        let user = await this.models.User.findOne({email: email}).populate('address');
        if(!user){
            this.throwError("404", "User not found");
        }
        
        const isPasswordValid = await user.verifyPassword(password);
        
        if (!isPasswordValid) {
            this.throwError("201", "Invalid password");
            return;
        }

        if(user.status === 'disabled'){
            this.throwError("201", "Account deactivated by admin!");
            return;
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },  // Payload
            this.config.JWT_SECRET,   //SECRET
            { expiresIn: '1d'}   // Expiry deadline
        )

        this.ctx.body = {
            success: true,
            message: "Login Successfully!",
            user: user,
            access_token: token
        };
    }

    async registerAdmin() {
        const {email, password, name} = this.ctx.request.body;
        let admin = null;
        try {
            admin = new this.models.Admin({
                email: email,
                password: password,
                name: name
            })

            console.log('Admin registered successfully')
        } catch (err) {
            console.log(err)
            this.throwError("301")
        }

        try {
            await admin.save()
        } catch (err) {
            console.log(err)
            this.throwError("301")
        }

        this.ctx.body = ({
            success: true,
            message: "Admin registered successfully"
        })
    }

    async loginAdmin(){
        const {email, password} = this.ctx.request.body;
        let admin = await this.models.Admin.findOne({email: email}).populate('address');
        if(!admin){
            this.throwError("404", "Admin Not Found");
        }

        const isPasswordValid = await admin.verifyPassword(password);

        if(!isPasswordValid){
            this.throwError("201", "Invalid Password");
            return;
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email },  
            this.config.JWT_SECRET,   
            { expiresIn: '1d'}   
        )

        this.ctx.body = {
            success: true,
            message: "Login Successfully!",
            admin: admin,
            access_token: token
        };
    }
}
module.exports = Auth;