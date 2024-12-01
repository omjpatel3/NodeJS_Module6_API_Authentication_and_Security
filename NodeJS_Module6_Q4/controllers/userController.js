const User = require("../models/userModel.js"); // Use the correct path for your model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, tokens: [] });
        await user.save();

        res.redirect("/users/login");
    } catch (err) {
        console.error(err);
        res.status(500).send("Registration failed. Please try again.");
    }
};
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, "jwtSecret", { expiresIn: "1h" });
            user.tokens.push(token);
            await user.save();

            req.session.user = { username, token };
            res.redirect("/");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Login failed. Please try again.");
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.session.user?.token;

        if (!token) {
            return res.status(400).send("No active session found");
        }

        const user = await User.findOne({ tokens: token });
        if (user) {
            user.tokens = user.tokens.filter((t) => t !== token);
            await user.save();
            req.session.destroy();
            res.redirect("/users/login");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error logging out");
    }
};

exports.logoutAll = async (req, res) => {
    try {
        const username = req.session.user?.username;

        if (!username) {
            return res.status(400).send("No active session found");
        }

        const user = await User.findOne({ username });
        if (user) {
            user.tokens = []; // Clear all tokens
            await user.save();
            req.session.destroy();
            res.redirect("/users/login");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error logging out");
    }
};
