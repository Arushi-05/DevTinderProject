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

connectDB().then(() => {
    console.log("DB connected!")
    app.listen(PORT, () => {
        console.log(`Hi server port ${PORT}.`)
    });
}).catch(err => {
    console.log(`DB not connected yet because of ${err}.`)
})