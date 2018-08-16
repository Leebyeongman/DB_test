// index.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // 1
const methodOverride = require("method-override");
const app = express();

// DB setting ...
mongoose.connect(process.env.MONGO_DB, { useMongoClient: true }); // 1
var db = mongoose.connection; // 2

db.once("open", () => {
    console.log("DB connected");
});
// 4
db.on("error", (err) => {
    console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json()); // 2
app.use(bodyParser.urlencoded({extended:true})); // 3
app.use(methodOverride("_method"));

// DB schema // 4
const contactSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true }
});

const Contact = mongoose.model("contact", contactSchema); //5

// Routes
// Home // 6
app.get("/", (req, res) => {
    res.redirect("/contacts");
});

// Contacts - Index // 7
app.get("/contacts", (req, res) => {
    Contact.find({}, (err, contacts) => {
        if(err) return res.json(err);
        res.render("contacts/index", {contacts:contacts});
    })
});
// Contacts - New // 8
app.get("/contacts/new", (req, res) => {
    res.render("contacts/new");
});

// Contacts - create // 9
app.post("/contacts", (req, res) => {
    Contact.create(req.body, (err, contact) => {
        if(err) return res.json(err);
        res.redirect("/contacts");
    });
});

// Contacts - show // 3 
app.get("/contacts/:id", (req, res) => {
    Contact.findOne({ _id: req.params.id }, (err, contact) => {
        if (err) return res.json(err);
        res.render("contacts/show", { contact: contact });
    });
});

// Contacts - edit // 4 
app.get("/contacts/:id/edit", (req, res) => {
    Contact.findOne({ _id: req.params.id }, (err, contact) => {
        if (err) return res.json(err);
        res.render("contacts/edit", { contact: contact });
    });
});

// Contacts - update // 5 
app.put("/contacts/:id", (req, res) => {
    Contact.findOneAndUpdate({ _id: req.params.id }, req.body, (err, contact) => {
        if (err) return res.json(err);
        res.redirect("/contacts/" + req.params.id);
    });
});
// Contacts - destroy // 6
app.delete("/contacts/:id", (req, res) => {
    Contact.remove({ _id: req.params.id }, (err, contact) => {
        if (err) return res.json(err);
        res.redirect("/contacts");
    });
});


// Port setting ...
app.listen(3000, () => {
    console.log("server on!");
});