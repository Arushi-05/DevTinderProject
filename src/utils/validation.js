
const validator=require('validator')
const validateSignUpData = (req) => {
    if (!req.body) {
        throw new Error("Request body is missing.")
    }
    const { firstName, lastName, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Names are not valid. Please enter again.")
    }
    else if(!validator.isStrongPassword(password)){
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
        "skills"
    ];
    const data = req.body;
    const isUpdatesAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k)
    )
    return isUpdatesAllowed

};

module.exports = { validateSignUpData , validateLoginData, validateProfileData};