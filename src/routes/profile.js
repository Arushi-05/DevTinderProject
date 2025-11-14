const express = require('express');
const authUser = require('../middlewares/adminAuth');
const router = express.Router();
const User = require('../models/user')
const { validateProfileData } = require("../utils/validation");

router.get("/profile/view", authUser, async (req, res) => {

    try {
        const { _id } = req.user
        const getUser = await User.findById(_id)
        res.send(getUser)
    } catch (err) {
        res.status(500).send(`${err.message}`)
    }
})

router.patch("/profile/edit", authUser, async (req, res) => {

    try {
        if (!validateProfileData(req)) {

            throw new Error("Update not allowed on one of these fields.")

        }
        const data = req.body;
        const loggedInUser = req.user;
        Object.keys(data).forEach((key) => {
            loggedInUser[key] = data[key]
        });
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName} ${loggedInUser.lastName}, your profile is updated successfully.`)

    } catch (err) {
        res.status(404).send("Update failed with error: " + err.message)

    }

})
module.exports = router;