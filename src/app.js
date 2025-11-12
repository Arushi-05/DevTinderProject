const express = require('express')
const User = require('./models/user')
const app = express()
const PORT = 8000
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const connectDB = require('./config/dataBase')
app.use(express.json());

app.post("/login", async (req, res) => {

    try {

        const { emailId, password } = req.body;

        async function checkUser(emailId, password) {
            //... fetch user from a db etc.
            const user = await User.findOne({ emailId });
            if (!user) {
                throw new Error("Email not found.")
            }
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.send("User Loggedin!")
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

app.post("/signup", async (req, res) => {

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

app.get("/user", async (req, res) => {

    const userEmailId = (req.body.emailId)
    try {
        const foundUsers = await User.find({ emailId: userEmailId })
        if (foundUsers.length === 0) {
            res.status(401).send("user is not found.")
        }
        else {
            res.send(foundUsers)
        }

    } catch (err) {
        res.status(500).send(`${err.message}`)
    }

})

app.get("/feed", async (req, res) => {
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

app.patch("/user/:userId", async (req, res) => {

    try {
        const data = req.body;
        const ALLOWED_UPDATES = [
            "userId",
            "age",
            "gender"
        ];
        const isUpdatesAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        )
        if (!isUpdatesAllowed) {
            throw new Error("Update not allowed on one of the fields.")
        }
        const updateId = req.params?.userId;
        const updatedUser = await User.findByIdAndUpdate(updateId, data, { returnDocument: 'after', runValidators: true })
        console.log(updatedUser)
        res.send("Updated the user successfully.")

    } catch (err) {
        res.status(404).send("Update failed with error: " + err.message)

    }

})
app.delete("/user", async (req, res) => {

    try {
        const deleteId = req.body.userId;
        const userToBeDeleted = await User.findByIdAndDelete(deleteId)
        res.send("Deleted the user.")

    } catch (err) {
        res.status(404).send("User can't be deleted right now, please try again.")

    }

})

connectDB().then(() => {
    console.log("DB connected!")
    app.listen(PORT, () => {
        console.log(`Hi server port ${PORT}.`)
    });
}).catch(err => {
    console.log(`DB not connected yet because of ${err}.`)
})