const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const eventSchema = new Schema({
    channel:{
      type:Schema.Types.ObjectId,
      ref: 'Channel'
    },
    author:{
      type:Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {type: String},
    message: {type: String},
    deleted:[
      {
        type:Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
})
module.exports = mongoose.model('Event', eventSchema)