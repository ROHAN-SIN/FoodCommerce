const User = require("../Models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    try {
        const { fullname, email, password } = req.body;

        // basic validation
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "fullname, email and password are required" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ fullname, email, password: hashed });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
        console.log(error);
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "secretkey", {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { registerUser, loginUser };