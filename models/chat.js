const mongoose = require('mongoose');
const chat_schema = mongoose.Schema({
    roomID:{type:String},
    sender:{type:String},
    receiver:{type:String},
   
    chats:[{
      username:{type:String},
      data:{type:Object},
      isRead:{type:Boolean},
      date:{type:String}
    }]
  })

  module.exports = mongoose.model('Chat', chat_schema);