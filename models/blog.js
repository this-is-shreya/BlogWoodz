const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    
    username:{type:String},
    email:{type:String},
    is_draft:{type:String, default:"n"},
    title: {
        type: String
    },
    customid:{type:String},
    desc: {
        type: String
    },
    genre:{type:String},
    ads:{type:String},
    thumbnail: {
        type: String
    },
    body: {
        type: Object
    },
    date:{type:String},
    blog_likes: {
        type: Number,
        default: 0
    },
    blog_views: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    comment: [{
        username: {
            type: String
        },
        date:{type:String},
        image: {
            data:{type:Buffer},
            contentType:{type: String}
        },
        data: {
            type: String
        },
        likes: {
            type: Number,
            default: 0
        },
        reply: [{
            username: {
                type: String
            },
            image: {
                data:{type:Buffer},
                contentType:{type: String}
            },
            data: {
                type: String
            },
            likes: {
                type: Number,
                default: 0
            }
        }]
    }]
})

module.exports = mongoose.model('Blog', BlogSchema);