const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authUser = async (req, res, next) => {

    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error("Token not found!")
        }
        const decodedObj = jwt.verify(token, 'shhhhhAru05@');
        const { _id } = decodedObj //from token we get the _id of the logged in user
        const foundUser = await User.findById(_id)
        if (!foundUser) {
            throw new Error("User not found during auth!")
        }
        req.user = foundUser
        next()

    } catch (err) {
        res.status(400).send(`${err.message}`)
    }


}

module.exports = authUser;