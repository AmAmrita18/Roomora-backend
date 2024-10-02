const BaseClass = require('./base');
const _ = require('lodash');

class Hotel extends BaseClass {
    constructor(ctx, next) {
        super(ctx, next);
    }

    async addHotel() {
        const { email, hotel_name, location, description, hotel_type, facilities, rooms, photos } = this.ctx.request.body;

        let admin = await this.models.Admin.findOne({ email });
        if (!admin) {
            return this.throwError("404", "Admin not found");
        }

        if (!hotel_name || !location || !hotel_type || !photos || photos.length < 2) {
            return this.throwError("400", "Required fields are missing or invalid. At least 2 photos are required.");
        }

        const newHotel = new this.models.Hotels({
            hotel_name,
            location,
            description: description || "No description provided",
            hotel_type,
            facilities: facilities || [],
            rooms: rooms || [],
            photos,
            feedbacks: []
        });

        try {
            const hotel = await newHotel.save();
            admin.hotels = [...admin.hotels, hotel.hotel_id]
            await admin.save()
        } catch (err) {
            console.log(err)
            this.throwError("201")
        } 

        this.ctx.body = {
            status: "success",
            message: "Hotel added successfully",
            data: newHotel
        };
    }

    async addHotel() {
        const { email, hotel_name, location, description, hotel_type, facilities, rooms, photos } = this.ctx.request.body;

        let admin = await this.models.Admin.findOne({ email });
        if (!admin) {
            return this.throwError("404", "Admin not found");
        }

        if (!hotel_name || !location || !hotel_type || !photos || photos.length < 2) {
            return this.throwError("400", "Required fields are missing or invalid. At least 2 photos are required.");
        }

        const newHotel = new this.models.Hotels({
            hotel_name,
            location,
            description: description || "No description provided",
            hotel_type,
            facilities: facilities || [],
            rooms: rooms || [],
            photos,
            feedbacks: []
        });

        try {
            const hotel = await newHotel.save();
            admin.hotels = [...admin.hotels, hotel.hotel_id]
            await admin.save()
        } catch (err) {
            console.log(err)
            this.throwError("201")
        } 

        this.ctx.body = {
            status: "success",
            message: "Hotel added successfully",
            data: newHotel
        };
    }
}

module.exports = Hotel;