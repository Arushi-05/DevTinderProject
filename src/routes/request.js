const express = require('express');
const User = require('../models/user')
const cookieParser = require('cookie-parser')
const router=express.Router();

router.get("/feed", async (req, res) => {
    try {
        const findAllUsers = await User.find()
        if (findAllUsers.length === 0) {
            res.status(401).send("Feed cannot be fetched. Try again.")
        }
        else {
            res.send(findAllUsers)
        }

    } catch (err) {
        res.status(500).send(`${err.message}`)
    }

})

module.exports=router;