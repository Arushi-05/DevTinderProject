const express = require('express')

//const authAdmin=require('./middlewares/adminAuth')
const app = express()
const PORT = 8000
const connectDB=require('./config/dataBase')




connectDB().then(()=>{
    console.log("DB connected!")
    app.listen(PORT, () => {
        console.log(`Hi server port ${PORT}.`)
    });
}).catch(err=>{
    console.log(`DB not connected yet because of ${err}.`)
})