const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: { 
        type: String,
        unique:true,
        required: true  
    },
    password: { 
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    contacts:[
        {
          type:Schema.Types.ObjectId,
          ref: 'User',
          default:[]
        }
    ],
    muted:[
        {
            type:Schema.Types.ObjectId,
            ref: 'User',
            default:[]
        }
    ],
    channels: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Channel',
            default:[]
        }
    ]
})
module.exports = mongoose.model('User', userSchema)