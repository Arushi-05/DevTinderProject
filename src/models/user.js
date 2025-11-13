const mongoose = require('mongoose');
const validator = require("validator")
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { type: String, required: true, trim: true, max: 50 },
    lastName: { type: String, max: 50, trim: true },
    emailId: {
        type: String, immutable: true, required: true, unique: true, trim: true, lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter a validate email address.")
            }
        }
    },
    password: { type: String, required: true, trim: true },
    age: { type: Number, min: 18 },
    gender: {
        type: String, lowercase: true, validate(val) {
            if (!['female', 'male'].includes(val)) {
                throw new Error("Please enter valid gender.");

            }
        }
    },
    skills: {
        type: [String],
        validate:
        {
            validator: function (arr) {
                return arr.length <= 5;
            },
            message: "5 skills are enough. Don't overdo it."
        }
    }

}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, 'shhhhhAru05@');
    console.log("token 1:" + token)
    return token;
}

const User = mongoose.model('User', userSchema);
module.exports = User;