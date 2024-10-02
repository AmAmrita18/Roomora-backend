const BaseClass = require("./base");

class Admin extends BaseClass {
    constructor(ctx, next) {
        super(ctx, next);

    }

    async update(){
        const {email, name, profile_photo,address_list} = this.ctx.request.body;

        let admin = await this.models.Admin.findOne({email});

        console.log({admin})
        if(!admin){
            this.throwError("404", "Admin not found");
        }

        if (name) admin.name = name;
        if (profile_photo) admin.profile_photo = profile_photo;
        if (address_list) admin.address_list = address_list;

        try {
            await admin.save();
        } catch (err) {
            console.log(err)
            this.throwError("301")
        }

        this.ctx.body = {
            success: true,
            message: "Profile Updated Successfully",
            admin: admin
        }
    }
}

module.exports = Admin