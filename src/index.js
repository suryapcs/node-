const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
const auth = require('./middleware/auth'); // This line

const app = express();

app.use(express.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use EJS
app.set('view engine', 'ejs');

// Static files
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        const { firstname, lastname, email, contactnumber, password } = req.body;

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.send("User already exists. Please choose a different Email.");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            contactnumber: contactnumber,
            password: hashedPassword
        });

        const userdata = await newUser.save();
        console.log(userdata);
        res.send("User created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.send("Email not found");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            const token = user.generateAuthToken();
            res.header('x-auth-token', token).send("Logged in successfully");
        } else {
            res.send("Wrong password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/protected", auth, (req, res) => {
    res.send("This is a protected route. You have access because you are authenticated.");
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on Port: ${port}`);
});
