const express = require('express')
const User = require('./models/user')
//const authAdmin=require('./middlewares/adminAuth')
const app = express()
const PORT = 8000
const connectDB = require('./config/dataBase')
app.use(express.json())
app.post("/signup", async (req, res) => {

    const user = new User(req.body)
    try {
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
app.delete("/user", async (req, res) => {

    try {
        const deleteId = req.body.userId;
        const userToBeDeleted = await User.findByIdAndDelete(deleteId)
        res.send("Deleted the user.")

    } catch (err) {
        res.status(401).send("User can't be deleted right now, please try again.")
      
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