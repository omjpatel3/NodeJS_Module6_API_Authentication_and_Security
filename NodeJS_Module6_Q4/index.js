const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoute.js");

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
}));
app.set("view engine", "ejs");


mongoose.connect("mongodb://127.0.0.1:27017/crudapp", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use("/users", userRoutes);

app.get("/", (req, res) => {
    if (req.session.user) {
        res.render("home", { username: req.session.user.username });
    } else {
        res.redirect("/users/login");
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
