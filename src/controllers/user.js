const _ = require("lodash");
const BaseClass = require("./base")
const Validation = require("../validations");

class User extends BaseClass {
    constructor(ctx, next){
        super(ctx, next);

    }

    async update() {
        const { email, name, profile_photo, address_list } = this.ctx.request.body;
    
        let user = await this.models.User.findOne({ email });
        if (!user) {
            this.throwError("404", "User not found");
        }
    
        if (name) user.name = name;
        if (profile_photo) user.profile_photo = profile_photo;
        if (address_list) user.address_list = address_list;
        
        try {
            // console.log({user})
            await user.save();
        } catch (err) {
            // console.log({err})
            this.throwError("301")
        }
    
        this.ctx.body = {
            success: true,
            message: "Profile updated successfully",
            user: user,
        };
    }

    async updatePassword(){
        const {email, password} = this.ctx.request.body;
        let {value, error} = Validation.User.UserPassword.validate({password});
        if(error){
            let errorMessage = _.size(error.details) > 0 ? error.details[0].message: null;
            this.throwError("201", errorMessage);
        }
        
        let user = await this.models.User.findOne({email});
        if (!user) {
            this.throwError("404", "User not found");
        }
        if(password) user.password = password;
        try{
            await user.save();
        }catch(err){
            this.throwError("301");
        }
        this.ctx.body = {
            success: true,
            message: "Password Updated successfully!"
        }
    }
}
module.exports = User;