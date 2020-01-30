const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const channelSchema = new Schema({
    name: {type: String},
    participants:[
      {
        type:Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    muted:[
      {
        type:Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    events:[
      {
        type:Schema.Types.ObjectId,
        ref: 'Event'
      }
    ]
})
module.exports = mongoose.model('Channel', channelSchema)