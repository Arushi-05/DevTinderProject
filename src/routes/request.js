const express = require('express');
const User = require('../models/user')
const cookieParser = require('cookie-parser')
const router = express.Router();
const { validateUser,validateConnectionRequestData, validateDuplicateRequest } = require('../utils/validation')
const authUser = require('../middlewares/adminAuth');
const ConnectionRequest = require('../models/connections');

router.post("/request/send/:status/:toUserId", authUser, async (req, res) => {
    console.log("Route handler started for /request/send");
    try {
        
        if (!(await validateUser(req))){
            throw new Error("This is hacker..")
        }
        if (await validateDuplicateRequest(req) ) {
            throw new Error("The request already exists.")
        }
        const toUserId = req.params.toUserId   //user i am interested in
        const fromUserId = req.user._id;  //from authUser
        const status = req.params.status
        if (!validateConnectionRequestData(req)) {
            throw new Error("Invalid status.")
        }
        const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
        const data = await connectionRequest.save();
        console.log("Saved connectionRequest:", data);
        res.json({ message: `${req.user.firstName} sent a connection request.`, data })

    } catch (err) {
        console.error("Error in /request/send route:", err.message)
        res.status(404).send(`${err.message}`)
    }

})
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

module.exports = router;