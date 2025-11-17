const express = require('express');
const User = require('../models/user')
const cookieParser = require('cookie-parser')
const router = express.Router();
const { validateUser, validateConnectionRequestData, validateDuplicateRequest } = require('../utils/validation')
const authUser = require('../middlewares/adminAuth');
const ConnectionRequest = require('../models/connections');
const USER_SAFE_DATA = "firstName lastName age gender skills";

router.post("/request/send/:status/:toUserId", authUser, async (req, res) => {
    console.log("Route handler started for /request/send");
    try {

        if (!(await validateUser(req))) {
            throw new Error("This is hacker..")
        }
        if (await validateDuplicateRequest(req)) {
            throw new Error("The request already exists.")
        }

        const toUserId = req.params.toUserId   //user i am interested in
        const fromUserId = req.user._id;  //from authUser
        const status = req.params.status
        if (!validateConnectionRequestData(req)) {
            throw new Error("Invalid status.")
        }
        const toUser = await User.findById(toUserId)
        const { firstName, lastName } = toUser;
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
            toFirstName: firstName,
            toLastName: lastName
        });
        const data = await connectionRequest.save();
        res.json({ message: `${req.user.firstName} sent a connection request to ${firstName} ${lastName}.`, data })

    } catch (err) {
        console.error("Error in /request/send route:", err.message)
        res.status(404).send(`${err.message}`)
    }

});

router.post("/request/review/:status/:requestId", authUser, async (req, res) => {
    console.log("Route handler started for /request/review");
    try {
        // here we will check all the request A has received from others
        // so first A should be logged in
        //status can be - accepted and rejected but the req must be in interested state.
        //validate status and requestId(requestId is the id of the connection request dumbo.)
        const { status, requestId } = req.params
        const loggedInUser = req.user._id;  //from authUser, this is user A checking his requests
        const ALLOWED_STATUSES = ['accepted', "rejected"]
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ message: "This is not a valid status." })
        }

        const connectionReq = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"

        })

        if (!connectionReq) {
            return res.status(404).json({ message: "You did not got any connection request." })
        }
        connectionReq.status = status;

        const data = await connectionReq.save();

        res.json({ message: `Connection request ${status} .`, data })

    } catch (err) {
        console.error("Error in /request/review route:", err.message)
        res.status(400).send(`${err.message}`)
    }

})

router.get("/feed", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user    //i am loggedin
        const page=parseInt(req.query.page) || 1
        let limit= parseInt(req.query.limit) || 5
        const skip= (page-1)*limit

        const connectionRequest = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId toFirstName");
        const hiddenUsers = new Set();
        connectionRequest.forEach((req) => {
            hiddenUsers.add(loggedInUser._id)
            hiddenUsers.add(req.fromUserId.toString())
            hiddenUsers.add(req.toUserId.toString())
        })
        const feed = await User.find({
            _id: { $nin: Array.from(hiddenUsers) }
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        res.send(feed)

    }
    catch (err) {
        res.status(400).send(`${err.message}`)
    }

})

module.exports = router;