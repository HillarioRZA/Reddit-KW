const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
    },
    doctorName: {
        type: String,
        required: true,
    },
    reserveDate: {
        type: Date,
        required: true,
    },
    complain: {
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    solution: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    medicines: [
        {
            code: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
