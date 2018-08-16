//index.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();

// DB setting
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;
db.once("open", () => {
    console.log("DB connected");
});
db.on("error", (err) => {
    console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));

// Routes
app.use("/", require("./routes/home")); //1
app.use("/contacts", require("./routes/contacts")); //2

// Port setting
app.listen(3000, () => {
    console.log("server on!");
});