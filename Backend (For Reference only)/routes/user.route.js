const express = require('express');
const router = express();

const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { username, name, alamat, email, password, role } = req.body;

        const existingUser = await User.findOne({ username });
        console.log(existingUser)
        if (existingUser) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        const newUser = new User({
            username,
            name,
            alamat,
            email,
            password,
            role,
        });

        const result = await newUser.save();
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username: username });
        console.log(existingUser)
        if (!existingUser) {
            return res.status(400).json({ message: "Username is not found" });
        }

        if(existingUser.password !== password){
            return res.status(400).json({ message: "Worng password" });
        }

        return res.status(201).json(existingUser);
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;
