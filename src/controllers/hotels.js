const bookings = require('../models/bookings');
const BaseClass = require('./base');
const _ = require('lodash');

class Hotels extends BaseClass {
    constructor(ctx, next) {
        super(ctx, next);
        // this._beforeMethods={
        //     bookHotel:['authMiddleware']
        // }
    }

    async addHotel() {
        const { email, hotel_name, location, description, hotel_type, facilities, rooms, photos, owner } = this.ctx.request.body;
    
        let admin = await this.models.Admin.findOne({ email });
        if (!admin) {
            return this.throwError("404", "Admin not found");
        }
    
        if (!hotel_name || !location || !hotel_type || !photos || photos.length < 2 || !rooms || rooms.length < 1 || !owner) {
            return this.throwError("400", "Required fields are missing or invalid.");
        }
    
        const newOwnerAddress = new this.models.Location(owner.address)
        await newOwnerAddress.save()

        const newOwner = new this.models.Owner({
            name: owner.name,
            email: owner.email,
            phone: owner.phone,
            profile_photo: '',
            address: newOwnerAddress._id
        })
        await newOwner.save()

        const newLocation = new this.models.Location(location);
        await newLocation.save();
    
        const roomPromises = rooms.map(async (room) => {
            const newRoom = new this.models.Room(room);
            return await newRoom.save();
        });
        const savedRooms = await Promise.all(roomPromises);
    
        const newHotel = new this.models.Hotels({
            hotel_name,
            location: newLocation._id,
            description: description || "No description provided",
            hotel_type,
            facilities: facilities || [],
            rooms: savedRooms.map(room => room._id),
            owner: newOwner._id,
            photos,
            feedbacks: []
        });
    
        let hotel;
        try {
            hotel = await newHotel.save();
            console.log({ hotel });
            admin.hotels = [...admin.hotels, hotel._id];
            await admin.save();
        } catch (err) {
            console.log(err);
            return this.throwError("500", "Error saving hotel");
        }
    
        this.ctx.body = {
            status: "success",
            message: "Hotel added successfully",
            data: hotel
        };
    }

    async updateHotel() {
        const { admin_id, _id, hotel_name, location, description, hotel_type, facilities, rooms, photos, owner } = this.ctx.request.body;
    
        console.log({ admin_id });
    
        let admin = await this.models.Admin.findOne({ _id: admin_id });
        if (!admin) {
            return this.throwError("404", "Admin not found");
        }
    
        let hotel = await this.models.Hotels.findOne({ _id: _id })
            .populate('rooms')
            .populate('location')
            .populate({
                path: 'owner',
                populate: {
                    path: 'address',
                    model: 'Location'
                }
            });
            
        if (!hotel) {
            return this.throwError("404", "Hotel not found");
        }
    
        // Validate the required fields
        if (!hotel_name || !location || !hotel_type || !photos || photos.length < 2 || !rooms || rooms.length < 1) {
            return this.throwError("400", "Required fields are missing or invalid.");
        }
    
        // Update Owner's Address
        const updatedOwnerAddress = await this.models.Location.findOneAndUpdate(
            { _id: hotel.owner.address._id },
            { $set: owner.address },
            { new: true, upsert: true }
        );
        await updatedOwnerAddress.save();
    
        owner.address = updatedOwnerAddress._id;
    
        // Update Owner details
        const updatedOwner = await this.models.Owner.findOneAndUpdate(
            { _id: hotel.owner._id },
            { $set: owner },
            { new: true, upsert: true }
        );
        await updatedOwner.save();
    
        // Update Hotel's Location
        const updatedLocation = await this.models.Location.findOneAndUpdate(
            { _id: hotel.location._id },
            { $set: location },
            { new: true, upsert: true }
        );
        await updatedLocation.save();
    
        // Handle Rooms (Update existing rooms and add new rooms if necessary)
        const roomPromises = rooms.map(async (room, i) => {
            if (hotel.rooms[i]) {
                // Update existing room
                const updatedRoom = await this.models.Room.findOneAndUpdate(
                    { _id: hotel.rooms[i]._id },
                    { $set: room },
                    { new: true, upsert: true }
                );
                return await updatedRoom.save();
            } else {
                // Add new room if it doesn't exist in the hotel's rooms array
                const newRoom = new this.models.Room(room);
                await newRoom.save();
                return newRoom;
            }
        });
        const savedRooms = await Promise.all(roomPromises);
    
        // Update hotel details
        hotel.hotel_name = hotel_name;
        hotel.location = updatedLocation._id;
        hotel.description = description || "No description provided!";
        hotel.photos = photos;
        hotel.hotel_type = hotel_type;
        hotel.facilities = facilities || [];
        hotel.owner = updatedOwner._id;
        hotel.rooms = savedRooms.map(room => room._id);
    
        let updatedHotel;
        try {
            updatedHotel = await hotel.save();
        } catch (err) {
            console.log(err);
            this.throwError("500", "Error saving hotel");
        }
    
        // Send success response
        this.ctx.body = {
            status: "success",
            message: "Hotel updated successfully",
            hotel: updatedHotel
        };
    }
    
    async deleteHotel() {
        const { email, hotel_id } = this.ctx.request.body;
        let admin = await this.models.Admin.findOne({ email });
        if (!admin) {
            return this.throwError("404", "Admin not found");
        }
    
        let hotel = await this.models.Hotels.findOne({ _id: hotel_id });
        console.log({hotel})
        if (!hotel) {
            return this.throwError("404", "Hotel not found");
        }
    
        try {
            await this.models.Hotels.deleteOne({ _id: hotel_id });  
              
            this.ctx.body = {
                status: "success",
                message: "Hotel deleted successfully",
            };
        } catch (err) {
            console.log(err);
            this.throwError("500", "Error deleting hotel");
        }
    }
    
    async getHotels() {
        try {
            const hotels = await this.models.Hotels.find()
                .populate('rooms')
                .populate('location')
                .populate({
                    path: 'owner',
                    populate: {
                        path: 'address', 
                        model: 'Location' 
                    }
                })
                .select('hotel_name _id location description hotel_type facilities rooms photos owner');
            
            if (!hotels || hotels.length === 0) {
                return this.throwError("404", "No hotels found");
            }
    
            this.ctx.body = {
                status: "success",
                message: "Hotels retrieved successfully",
                hotels: hotels
            };
        } catch (err) {
            console.log(err);
            this.throwError("500", "Internal Server Error");
        }
    }  
    
    async getHotel() {
        try {
            const {hotel_id} = this.ctx.request.body;
            const hotel = await this.models.Hotels.findOne({_id: hotel_id})
                    .populate('rooms')
                    .populate('location')
                    .populate({
                        path: 'owner',
                        populate: {
                            path: 'address', 
                            model: 'Location' 
                        }
                    })
                    .select('hotel_name _id location description hotel_type facilities rooms photos owner');
            if (!hotel) {
                return this.throwError("404", "Hotel not found");
            }
    
            this.ctx.body = {
                status: "success",
                message: "Hotel retrieved successfully",
                hotel: hotel
            };
        } catch (err) {
            console.log(err);
            this.throwError("500", "Internal Server Error");
        }
    }  

    async bookHotel(){
        const { user, hotel, room, numOfRooms, check_in, check_out, totalPrice } = this.ctx.request.body;

        console.log({user, hotel, room})

        if (!check_in || !check_out){
            this.throwError("201", "Please provide check in and check out date")
            return
        }

        let isUserExists = await this.models.User.findOne({ _id: user })
        if (!isUserExists) {
            this.throwError("404", "User not found!")
            return
        }

        let isHotelExist = await this.models.Hotels.findOne({ _id: hotel })
        if (!isHotelExist) {
            this.throwError("404", "Hotel not found");
            return
        }

        let isRoomExist = await this.models.Room.findOne({ _id: room })
        if (!isRoomExist) {
            this.throwError("404", "Room not found!");
            return;
        }

        if (isRoomExist.available_rooms < numOfRooms) {
            this.throwError("400", "Not enough rooms available!");
            return;
        }


        isRoomExist.available_rooms -= numOfRooms;
        await isRoomExist.save();
        
        let booking = new this.models.Bookings({
            user,
            hotel,
            room,
            check_in,
            check_out,
            totalPrice
        })

        try {
            isUserExists.bookings = [...isUserExists.bookings, booking._id]
            await booking.save()
            await isUserExists.save()
        } catch (err) {
            console.log(err)
            this.throwError("301")
        }

        const bookingDetails = await this.models.Bookings.findOne({ _id: booking._id})
                                .populate('user')
                                .populate('hotel')
                                .populate('room')
                                .select('user hotel room check_in check_out totalPrice')

        this.ctx.body = {
            success: true,
            message: "Booking completed successfully",
            booking: bookingDetails
        };
    }

    
}

module.exports = Hotels;