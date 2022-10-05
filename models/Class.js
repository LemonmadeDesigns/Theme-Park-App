const mongoose = require("mongoose")

const classSchema = new mongoose.Schema(({
    id: Number,
    exam: String,
    name: String,
    result: Number
}))

const Class = mongoose.model('Class', classSchema);

module.exports = {
    Class,
    classSchema
}