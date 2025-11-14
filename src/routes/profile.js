const express = require('express');
const authUser = require('../middlewares/adminAuth');
const router = express.Router();
const User = require('../models/user')
router.get("/profile", authUser, async (req, res) => {

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

        const data = req.body;

        const ALLOWED_UPDATES = [
            "age",
            "gender",
            "skills"
        ];
        const isUpdatesAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        )
        if (!isUpdatesAllowed) {
            throw new Error("Update not allowed on one of the fields.")
        } else {
            const loggedInUser = req.user;
            console.log(loggedInUser)
            Object.keys(data).forEach((key) => {
                loggedInUser[key] = data[key]
            })
            console.log(loggedInUser)
            await loggedInUser.save();
            res.send(`${loggedInUser.firstName} ${loggedInUser.lastName}, your profile is updated successfully.`)
        }
    } catch (err) {
        res.status(404).send("Update failed with error: " + err.message)

    }

})
module.exports = router;