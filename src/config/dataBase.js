const mongoose = require('mongoose');

const connectDB=async ()=> {
    await mongoose.connect('mongodb+srv://mearushikapoor_db_user:GElVJ0C9mTNKo3zX@projectdev.t6lumjb.mongodb.net/DevTinderUserData');
}
module.exports=connectDB;

