// index.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // 1
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

// DB schema // 4
const contactSchema = mongoose.Schema({
 name:{type:String, required:true, unique:true},
 email:{type:String},
 phone:{type:String}
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

// Port setting ...
app.listen(3000, () => {
    console.log("server on!");
});