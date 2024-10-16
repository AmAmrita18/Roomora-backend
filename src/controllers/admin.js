const BaseClass = require("./base");
const Validation = require("../validations");

class Admin extends BaseClass {
    constructor(ctx, next) {
        super(ctx, next);
    }

    async update(){
        const {email, name, profile_photo,address, phone} = this.ctx.request.body;

        let admin = await this.models.Admin.findOne({email});

        if(!admin){
            this.throwError("404", "Admin not found");
        }

        const newAddress = new this.models.Location(address);
        await newAddress.save();

        if (name) admin.name = name;
        if (profile_photo) admin.profile_photo = profile_photo;
        if (address) admin.address = newAddress._id;
        if(phone) admin.phone = phone;

        try {
            await admin.save();
        } catch (err) {
            console.log(err)
            this.throwError("301")
        }

        const savedAdmin = await this.models.Admin.findOne({_id: admin._id})
            .populate('address')

        this.ctx.body = {
            success: true,
            message: "Profile Updated Successfully",
            admin: savedAdmin
        }
    }

    async updatePassword(){
        const {admin_id, password} = this.ctx.request.body;
        console.log({admin_id, password})
        let {value, error} = Validation.User.UserPassword.validate({password});
        if(error){
            let errorMessage = _.size(error.details) > 0 ? error.details[0].message: null;
            this.throwError("201", errorMessage);
        }
        
        let admin = await this.models.Admin.findOne({_id: admin_id});
        if (!admin) {
            this.throwError("404", "Admin not found");
        }
        if(password) admin.password = password;
        try{
            await admin.save();
        }catch(err){
            this.throwError("301");
        }

        const savedAdmin = await this.models.Admin.findOne({_id: admin._id})
            .populate('address')

        this.ctx.body = {
            success: true,
            message: "Password Updated successfully!",
            admin: savedAdmin
        }
    }

    async updateUserStatus() {
        const {userId, status} = this.ctx.request.body;
        console.log({userId, status})

        const user = await this.models.User.findOne({_id: userId})

        if(!user) {
            this.throwError("404", "User not found!")
        }

        if(!status) {
            this.throwError("400", "Please provide status!")
        }

        user.status = status
        try {
            await user.save()
        } catch (err) {
            console.log({err})
            this.throwError("301")
        }

        const updatedUser = await this.models.User.findOne({ _id: user._id })
            .populate('address')
            .select('name email status address')

        this.ctx.body = {
            success: true,
            message: "User Status updated successfully",
            user: updatedUser
        }
    }

    async updateBookingStatus() {
        const {booking_id, status} = this.ctx.request.body;

        const booking = await this.models.Bookings.findOne({_id: booking_id})

        if(!booking) {
            this.throwError("404", "Booking not found!")
        }

        if(!status) {
            this.throwError("400", "Please provide status!")
        }

        booking.booking_status = status
        try {
            await booking.save()
        } catch (err) {
            console.log({err})
            this.throwError("301")
        }

        const updatedBooking = await this.models.Bookings.findOne({ _id: booking._id })
        .populate('user')
        .populate('hotel')
        .populate('room')
        .select('user hotel _id booking_status room check_in check_out totalPrice')

        this.ctx.body = {
            success: true,
            message: "Booking Status updated successfully",
            booking: updatedBooking
        }
    }
}

module.exports = Admin