
const validator=require('validator')
const validateSignUpData = (req) => {
    const { firstName, lastName, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Names are not valid. Please enter again.")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("This is not a strong password, try something else.")
    }

};

module.exports = { validateSignUpData };