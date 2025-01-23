const express = require('express')
const router = express()

const Appointment = require('../models/Appointment')

router.post('/', async (req, res) => {
    const { index, doctorName, reserveDate, complain, patientName, solution, status } = req.body;

    const newAppointment = new Appointment({
        index, doctorName, reserveDate, complain, patientName, solution, status 
    })
    const result = await newAppointment.save()

    return res.status(201).json(result)
})

router.get("/", async (req, res) =>{
    const result = await Appointment.find();
    if(!result) return res.status(400).send("Error")
    return res.status(200).json(result)
})

router.get("/allappointment", async (req, res) => {
    try {
        const count = await Appointment.countDocuments(); 
        return res.status(200).json({ count });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});


router.get("/appointment?", async (req, res) => {
    const { username } = req.query; 
    console.log(username);
    try {
        const result = await Appointment.find({ patientName: username });
        console.log(result)
        if (!result.length) return res.status(404).send("No appointment found");
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientName: req.query.patientName });

        // Populate medicines if referenced in appointments
        const populatedAppointments = await Promise.all(
            appointments.map(async (appointment) => {
                const medicines = await Medicine.find({ code: { $in: appointment.recommendedMedicines || [] } });
                return { ...appointment.toObject(), medicines };
            })
        );

        res.status(200).json(populatedAppointments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.put('/buy-medicine', async (req, res) => {
    const { appointmentId, medicines } = req.body;

    try {
        const outOfStock = [];
        const updates = [];

        for (const med of medicines) {
            const medicine = await Medicine.findOne({ code: med.code });

            if (!medicine || medicine.stock < 1) {
                outOfStock.push(medicine?.name || med.code);
            } else {
                updates.push({ code: med.code, newStock: medicine.stock - 1 });
            }
        }

        if (outOfStock.length > 0) {
            return res.status(400).json({ message: 'Out of stock', outOfStock });
        }

        for (const update of updates) {
            await Medicine.updateOne({ code: update.code }, { stock: update.newStock });
        }

        await Appointment.updateOne({ _id: appointmentId }, { status: 'Purchased' });

        res.status(200).json({ message: 'Medicines purchased successfully' });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).send('Internal server error');
    }
});


module.exports= router;