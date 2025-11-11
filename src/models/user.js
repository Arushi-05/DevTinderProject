const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { type: String, required: true ,trim:true}, // String is shorthand for {type: String}
    lastName: { type: String },
    emailId: { type: String,immutable: true , required: true, unique:true , trim:true,lowercase:true},
    password: { type: String, required: true ,trim:true},
    age: { type: Number ,min:18 },
    gender: { type: String, validate(val){
        if(!['female', 'male'].includes(val)){
            throw new Error("Please enter valid gender.");
            
        }
    } }

});

const User = mongoose.model('User', userSchema);
module.exports=User;