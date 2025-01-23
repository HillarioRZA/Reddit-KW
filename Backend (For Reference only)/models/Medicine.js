const mongoose = require('mongoose')

const MedicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
});

const Medicine = mongoose.model('Medicine', MedicineSchema);

module.exports= Medicine;