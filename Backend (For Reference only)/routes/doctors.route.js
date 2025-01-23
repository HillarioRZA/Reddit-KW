const express = require('express')
const router = express()

const User = require('../models/User');
const Appointment = require('../models/Appointment')
const Medicine = require('../models/Medicine');

router.get("/", async (req, res) => {

    try {
        const result = await User.find({ role: "Dokter" });
        if (!result) return res.status(404).send("No doctor found");
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
})

router.get("/appointment/?", async (req, res) => {
    const { name } = req.query; 
    try {
        const result = await Appointment.find({ doctorName: name });
        if (!result.length) return res.status(404).send("No appointment found");
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

router.get("/appointmentselect/?", async (req, res) => {
    const { index } = req.query; 
    try {
        const result = await Appointment.find({ index: index });
        if (!result.length) return res.status(404).send("No appointment found");
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
})

router.put("/appointmentselect/giveconsult", async (req, res) => {
    const { index } = req.query;
    const { status, solution, medicines } = req.body; // Include medicines in the request body
    console.log("pass1")
    try {
        // Update the appointment with status, solution, and medicines
        const result = await Appointment.findOneAndUpdate(
            { index }, // Find appointment by index
            {
                $set: {
                    status,
                    solution,
                    medicines, // Add or update prescribed medicines
                },
            },
            { new: true } // Return the updated document
        );
        console.log("pass2")

        if (!result) return res.status(404).send("No appointment found");

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});


router.get('/available-medicines', async (req, res) => {
    try {
        const medicines = await Medicine.find({ status: 'Not Banned' });
        res.status(200).json(medicines);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


module.exports= router;