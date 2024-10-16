const BaseClass = require('./base');
const _ = require('lodash');

class Hotel extends BaseClass {
    constructor(ctx, next) {
        super(ctx, next);
        this._beforeMethods={
            bookHotel:['authMiddleware']
        }
    }

    async getUsers() {
        try {
            const users = await this.models.User.find()
                .populate('address')
                .select('name email phone address status _id')
            
            if (!users || users.length === 0) {
                console.log('No users')
                return this.throwError("404", "No Users found");
            }
    
            this.ctx.body = {
                status: "success",
                message: "Users retrieved successfully",
                users: users
            };
        } catch (err) {
            console.log(err);
            this.throwError("500", "Internal Server Error");
        }
    }

    async getBookings() {
        try {
            const bookings = await this.models.Bookings.find()
                .populate('user')
                .populate('hotel')
                .populate('room')
                .select('user _id hotel booking_status room check_in check_out totalPrice')
            
            if (!bookings || bookings.length === 0) {
                console.log('No bookings')
                return this.throwError("404", "No bookings found");
            }
    
            this.ctx.body = {
                status: "success",
                message: "Bookings retrieved successfully",
                bookings: bookings
            };
        } catch (err) {
            console.log(err);
            this.throwError("500", "Internal Server Error");
        }
    }
}

module.exports = Hotel;