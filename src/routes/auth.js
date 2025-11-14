const express = require('express');
const router = express.Router();
const { validateSignUpData, validateLoginData } = require("../utils/validation");
const User = require('../models/user')
const bcrypt = require('bcrypt');
router.post("/signup", async (req, res) => {

    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password, ...otherFields } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName, lastName, emailId, password: passwordHash, ...otherFields
        })
        await user.save();
        res.send("New user added successfully.")
    }
    catch (err) {
        res.status(400).send(`Error saving the new user:${err.message}`)
    }
})

router.post("/login", async (req, res) => {
    try {

        validateLoginData(req)
        const { emailId, password } = req.body;

        async function checkUser(emailId, password) {

            const user = await User.findOne({ emailId });
            if (!user) {
                throw new Error("User not found!")
            }
            const match = await bcrypt.compare(password, user.password);
            if (match) {

                const token = await user.getJWT()
                console.log("token 2:" + token)
                res.cookie("token", token)
                res.send(`${user.firstName} is loggedin now.`)
            }
            else {
                throw new Error("Cannot login the user. Please check credentials.")
            }
        }
        await checkUser(emailId, password)
        //const match = await bcrypt.compare(password, user.password);

        // if (match) {
        //     res.send("User Loggedin!")
        // }
        // else {
        //     throw new Error("Cannot login the user. Please check credentials.")
        // }}
    }
    catch (err) {
        res.status(400).send("ERROR is: " + err.message)
    }
})

router.post("/logout", async (req, res) => {
    res.clearCookie("token")
    res.send(`user is logged out.`);
})

module.exports = router;


// {       
//     "emailId": "avi@gmail.com",
//     "password": "Avinash@30"
//   }
// {
// "emailId": "tilak@gmail.com",
//   "password": "Tilak@123"
// }