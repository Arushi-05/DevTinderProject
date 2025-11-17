const express = require('express')
const User = require('./models/user')
const app = express()
const cors = require('cors')
const PORT = 8000
//const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
//const bcrypt = require('bcrypt');
const connectDB = require('./config/dataBase');
const authUser = require('./middlewares/adminAuth');
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser())

const profileRouter = require('./routes/profile')
const authRouter = require('./routes/auth')
const requestRouter = require('./routes/request')

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)

app.get("/user", authUser, async (req, res) => {
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




connectDB().then(() => {
    console.log("DB connected!")
    app.listen(PORT, () => {
        console.log(`Hi server port ${PORT}.`)
    });
}).catch(err => {
    console.log(`DB not connected yet because of ${err}.`)
})