const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authUser = async (req, res, next) => {

    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error("Token not found!")
        }
        const decodedObj = jwt.verify(token, 'shhhhhAru05@');
        const {userId}=decodedObj //from token we get the userid trying to login
        const user=req.body._id
        //const { emailId } = decodedObj
        //const userEmailId = (req.body.emailId)
        if (user === userId) {
            const foundUser = await User.findOne({ user })
            if (!foundUser) {
                throw new Error("User not found during auth!")
            }
            req.user = foundUser
            next()
        }

    } catch (err) {
        res.status(400).send(`${err.message}`)
    }


}

module.exports = authUser;