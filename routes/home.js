//routes/home.js

const express = require("express");
const router = express.Router(); //1

// Home 
router.get("/", (req, res) => { //2
    res.redirect("/contacts");
});

module.exports = router; // 3