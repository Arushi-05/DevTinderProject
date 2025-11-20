
const validator = require('validator');
const User = require('../models/user');
const mongoose = require('mongoose');
const ConnectionRequest = require('../models/connections');
const jwt = require('jsonwebtoken');
const validateSignUpData = (req) => {
    if (!req.body) {
        throw new Error("Request body is missing.")
    }
    const { firstName, lastName, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Names are not valid. Please enter again.")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("This is not a strong password, try something else.")
    }

};

const validateLoginData = (req) => {
    if (!req.body) {
        throw new Error("Request body is missing. Please enter email and password.")
    }
    const { emailId, password } = req.body;

    if (!emailId || !password) {
        throw new Error(" Please enter email and password.")
    }

};

const validateProfileData = (req) => {
    const ALLOWED_UPDATES = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "skills",
        "photoUrl"
    ];
    const data = req.body;
    const isUpdatesAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k)
    )
    return isUpdatesAllowed

};

const validateConnectionRequestData = (req) => {
    const ALLOWED_STATUSES = [
        "ignored",
        "interested"
    ];
    const status = req.params.status;
    const isStatusAllowed = ALLOWED_STATUSES.includes(status);
    return isStatusAllowed

};


const validateUser = async (req) => {
    try {
        console.log("entered user validation")
        const toUserId = req.params.toUserId
        if(!mongoose.Types.ObjectId.isValid(toUserId)){
            throw new Error("This is not a valid user ID.")
        }
        const { token } = req.cookies
        const decodedObj = User.decodeToken(token)
        const fromUserId = decodedObj._id;
        // const decodedObj = jwt.verify(token, 'shhhhhAru05@');
        // const { _id } = decodedObj //from token we get the _id of the logged in user
        // const user= await User.findById(_id)
        // const fromUserId=user._id  //this is typeof object
       
        if(toUserId ===fromUserId.toString()){  //converting to string
            throw new Error("You cant send request to yourself!")
        }
        const isUserPresentInDB = await User.findById(toUserId)
        return isUserPresentInDB
    } catch (err) {
        throw err;
    }
};
const validateDuplicateRequest = async (req) => {
    try {
        console.log("entered duplicate request validation")
        const { token } = req.cookies
        const decodedObj = User.decodeToken(token)
        const fromUserId = decodedObj._id;
        // const foundUser = await User.findById(user)
        // const decodedObj = jwt.verify(token, 'shhhhhAru05@');
        // const { _id } = decodedObj //from token we get the _id of the logged in user
        // const user= await User.findById(_id)
        // const fromUserId=user._id   //loggedin user who sent connection req
        const toUserId = req.params.toUserId
    
        const existingRequest = await ConnectionRequest.findOne({
            $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }]
        })
        
        return existingRequest
    } catch (err) {
    
        throw err;
    }
};


module.exports = { validateSignUpData,validateUser, validateDuplicateRequest, validateConnectionRequestData, validateLoginData, validateProfileData };