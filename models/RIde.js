const mongoose = require("mongoose")

const rideSchema = new mongoose.Schema(({
    id: Number,
    park: String,
    ride: String,
    rating: Number
}))

const Ride = mongoose.model('Ride', rideSchema);

module.exports = {
    Ride,
    rideSchema
}