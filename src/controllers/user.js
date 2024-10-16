const _ = require("lodash");
const BaseClass = require("./base")
const Validation = require("../validations");

class User extends BaseClass {
    constructor(ctx, next){
        super(ctx, next);

    }

    async update() {
        const { email, name, profile_photo, address, phone } = this.ctx.request.body;
    
        let user = await this.models.User.findOne({ email });
        if (!user) {
            this.throwError("404", "User not found");
        }
    
        if (!name) {
            return this.throwError("400", "Required fields are missing or invalid.");
        }
        const newAddress = new this.models.Location(address)
        await newAddress.save()

        if(name) user.name = name;
        if(profile_photo) user.profile_photo = profile_photo || "";
        if(address) user.address = newAddress._id;
        if(phone) user.phone = phone;
        
        try {
            await user.save();
        } catch (err) {
            this.throwError("301")
        }

        const savedUser = await this.models.User.findOne({_id: user._id})
            .populate('address')
    
        this.ctx.body = {
            success: true,
            message: "Profile updated successfully",
            user: savedUser,
        };
    }

    async updatePassword(){
        const {user_id, password} = this.ctx.request.body;
        console.log({user_id, password})
        let {value, error} = Validation.User.UserPassword.validate({password});
        if(error){
            let errorMessage = _.size(error.details) > 0 ? error.details[0].message: null;
            this.throwError("201", errorMessage);
        }
        
        let user = await this.models.User.findOne({_id: user_id});
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
    async getUserBookings() {
        try {
            const { user_id } = this.ctx.request.body;
            const user = await this.models.User.findOne({ _id: user_id })
                .populate({
                    path: 'bookings',
                    populate: [
                        {
                            path: 'hotel',
                            model: 'Hotels'
                        },
                        {
                            path: 'room',
                            model: 'Room'
                        }
                    ]
                })
                .select('bookings');
    
            if (!user) {
                return this.throwError("404", "User not found");
            }
    
            this.ctx.body = {
                status: "success",
                message: "Bookings retrieved successfully",
                bookings: user.bookings
            };
        } catch (err) {
            console.log(err);
            this.throwError("500", "Internal Server Error");
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
module.exports = User;