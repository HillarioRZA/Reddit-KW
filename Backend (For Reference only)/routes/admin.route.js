const express = require('express');
const router = express.Router();

const Medicine = require('../models/Medicine');
const User = require('../models/User');

router.post("/", async (req, res) => {

    try {
        const { name, price, stock, detail } = req.body;
        console.log(name)
        console.log(price)
        console.log(stock)
        console.log(detail)

        if (!name || !price || !stock || !detail) {
            return res.status(400).send("All fields are required");
        }


        const prefix = name.substring(0, 2).toUpperCase();
        const count = await Medicine.countDocuments({ code: { $regex: `^${prefix}` } });
        const code = `${prefix}${count + 1}`;
        const status = "Not Banned"


        const newMedicine = new Medicine({
            name,
            code,
            price,
            stock,
            detail,
            status
        });

        const result = await newMedicine.save();
        return res.status(201).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

router.get("/", async (req, res) => {

    try {
        const result = await Medicine.find();
        if (!result) return res.status(404).send("No medicines found");
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

router.get("/user", async (req, res) => {
    try {
        const result = await User.find();
        if (!result) return res.status(404).send("No user found");
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

router.put("/medicinestatus", async (req, res) => {
    const { code, status } = req.body; // Receive index and new status from the frontend
    console.log(code)
    console.log(status)
    try {
        const updatedMedicine = await Medicine.findOneAndUpdate(
            { code }, 
            { status }, 
            { new: true } 
        );

        if (!updatedMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json(updatedMedicine);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.put("/medicine/edit", async (req, res) => {
    const { code } = req.query;
    const { name, price, stock, detail } = req.body;

    try {
        const result = await Medicine.findOneAndUpdate(
            { code }, 
            { $set: { name, price, stock, detail } },
            { new: true } // Return updated document
        );

        if (!result) return res.status(404).send("No medicine found");
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error updating medicine:", error);
        return res.status(500).send("Internal server error");
    }
});


module.exports = router;
