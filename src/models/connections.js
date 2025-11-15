const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectionSchema = new mongoose.Schema(

    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "accepted", "interested", "rejected"],
                message: `{VALUE} is not supported.`
            }

        },


    }, { timestamps: true })


    const ConnectionRequest = mongoose.model('ConnectionRequest', connectionSchema);
module.exports = ConnectionRequest;