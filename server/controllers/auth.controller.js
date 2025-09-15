const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Import User schema
// const StaffShift = require("../models/staffShift.model");

// User registration
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, username, password, role, branch, contactDetails, department } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            username,
            password: hashedPassword,
            role,
            department,
            branch,
            contactDetails
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed.' });
        console.log(error)
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("request coming from lab!!")

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials.' });

        // implementing shift feature

        // Allow anytime access for owner and manager
        if (user.role === "owner" || user.role === "manager") {
            const token = jwt.sign(
                { id: user._id, role: user.role },
                "lion64",
                { expiresIn: '1d' }
            );
            return res.status(200).json({
                message: "Login successful!",
                token,
                shiftEndTime: null,
                user: { id: user._id, firstname: user.firstName, role: user.role, department: user.department }
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed.' });
    }
};

exports.logout = (req, res) => {
    // In a real-world application, we might want to blacklist the token here
    // For now, we'll just respond with a success message
    res.status(200).json({ message: "Logout successful." });
};

exports.findAllUSers = async (req, res) => {
    const users = await User.find({});
    if(!users) {
        res.status(404).send({message: "no users found"})
    } else {
        return res.send(users);
    }
}