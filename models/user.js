const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let d = new Date()
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    verif:{type:String, default:"no"},
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required:true,
    },
    dp: {
        data:{type:Buffer},
        contentType:{type:String},

    },
    links:{
        linkedin:{type:String},
        pinterest:{type:String},
        github:{type:String},
        instagram:{type:String},
        youtube:{type:String}
    },
    about:{type:String},
    interest:{type:Array},
    name:{type:String},
    liked_comments: {
        type: Array
    },
    comments_made: {
        type: Array
    },
    myBlogId: {
        type: Array
    },
    liked_blogs: {
        type: Array
    },
    followers:{type:Array},
    following:{type:Array},
    bookmark:{type:Array},
    notif:[{
        type:{type:String},
        name:{type:String},
        blog:{type:String},
        date:{type:String, default: ""+d.getDate()+"-"+d.getMonth()+1+"-"+d.getFullYear()}
    }],
    notif_status:{type:Number,default:0}
    
})

module.exports = mongoose.model('User', UserSchema);