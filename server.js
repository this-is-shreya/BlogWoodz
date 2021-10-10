const bcrypt = require("bcrypt");
const express = require("express")
const forceSsl = require('force-ssl-heroku');
const app = express()

app.use(forceSsl);
const cors = require("cors")

const bodyParser = require("body-parser")
const path = require("path")
const ObjectId = require('mongodb').ObjectID;
const socket = require("socket.io")
const customId = require("custom-id")
const nodemailer = require("nodemailer")
const SMTPConnection = require("nodemailer/lib/smtp-connection");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const fu = require("express-fileupload")
app.use(fu())
app.use(cookieParser())
app.use(cors())
const sanitizeHtml = require('sanitize-html')
const mongoose = require("mongoose")
dotenv.config({path:"./config.env"})
const DB = process.env.DATABASE
 mongoose.connect(DB,
 {useNewUrlParser:true,
useUnifiedTopology:true,
useFindAndModify:false, useCreateIndex: true })
const mymodel = require("./models/blog")
const usermodel = require("./models/user")
const chat_model = require("./models/chat")

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
const http = require("http").createServer(app)

http.listen(process.env.PORT || 3000,()=>{
  console.log("listening at 3000")
})
const io = socket(http)


app.set("view engine","ejs")





  


app.get("/",(req,res)=>{
  res.clearCookie("username")
  res.clearCookie("email")
  res.render("login")
})
app.post("/login-user",async(req,res)=>{
  let doc = await usermodel.find({email:req.body.email})
  if(doc.length>0){
  const validPassword = await bcrypt.compare(req.body.password, doc[0].password);
  if(validPassword && doc[0].verif=="yes"){
    res.cookie("username",doc[0].username)
    res.cookie("email",doc[0].email)
    res.send(doc[0].username)
    
    console.log("username is "+doc[0].username)
  }
  else{
    res.send("incorrect")
  }
  
}
  else{
    res.send("incorrect")
  }
  
})
app.post("/signup-user",async(req,res)=>{
  let doc = await usermodel.find({email:req.body.email})
  //remove whitespaces from username and then check
  let user2 = (req.body.username).replace(" ","")
  let doc2 = await usermodel.find({username:user2})
  if(doc.length>0){
    res.send("email")
  }
  else if(doc2.length>0){
    res.send("user")
  }
  else{
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    password= await bcrypt.hash(req.body.password, salt);
    const data = new usermodel({
      email:req.body.email,
      username:user2,
      password:password,
      
    })
    //now set verif route,status in schema,redirect..
   let doc = await data.save()
   let verif = "https://bloggily.herokuapp.com/verification/"+doc._id
   console.log(verif)
   
   
   let str='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"></head><body style="font-family: serif;font-size: 18px;padding: 10px;"><h2>Welcome to BlogWoodz!</h2><p >BlogWoodz provides you the platform to express your ideas and share your stories online. It offers you features like chatting with other bloggers, view real-time trending of blogs and much more!</p> <p>To avail all these features all you need to do is click on the verification link below:</p><a href="'+verif+'">Click here</a><br><br><p class="text-muted">Team BlogWoodz</p></html>'
   let transporter = nodemailer.createTransport({
     
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    
    auth: {
        user: process.env.TEAM,
        pass: process.env.PASSWORD
    },
    tls:{
      rejectUnauthorized:false
    }
});
let mailOptions = {
    to: req.body.email,
    subject: "Verification Link",
    text: "",
    html:str
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    else{
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.send("done")}
});
   
    // res.cookie("username",req.body.username)
    // res.cookie("email",req.body.email)
    
  }
  
})
app.post("/forgot-password", async(req,res)=>{
  let email = req.body.email
  let doc = await usermodel.find({email:email})
  if(doc.length>0){
  let verif = "https://bloggily.herokuapp.com/reset/"+doc[0]._id
  // let verif = "http://localhost:3000/reset/"+doc[0]._id

  let str='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"></head><body style="font-family: serif;font-size: 18px;padding: 10px;"><h2>Reset Password</h2><p>Click on the link below to reset your password.</p><a href="'+verif+'">Click here</a><br><br><p class="text-muted">Team BlogWoodz</p></html>'
  
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,

    auth: {
      user: process.env.TEAM,
        pass: process.env.PASSWORD
    },
    tls: {
     rejectUnauthorized:false
  }
});
let mailOptions = {
    to: email,
    subject: "Password Recovery Link",
    text: "",
    html:str
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.send("sent")
});

}
})
app.get("/reset/:id",async(req,res)=>{

  res.render("resetpassword")
})
app.post("/reset-password", async(req,res)=>{
  // console.log(req.body.id)
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
 let password2 = await bcrypt.hash(req.body.password, salt);
await usermodel.findByIdAndUpdate({_id:req.body.id},{
  $set:{
    password:password2
  }
})
res.send("done")
})
app.get("/verification/:id", async(req,res)=>{
let doc = await usermodel.findByIdAndUpdate({_id:req.params.id},{
  $set:{verif:"yes"}
})
res.cookie("username",doc.username)
    res.cookie("email",doc.email)
res.redirect("/home")
})
app.get("/home",async(req,res)=>{
  let username=""
  if(req.cookies['username']){
    username=req.cookies['username']
  }
  else{
    username="nothing"
  }
  let user = await usermodel.find({})
  if(user[0].interest != null && user[0].interest.length>0){
    await mymodel.find({genre:{$in:user[0].interest},is_draft:"n"}).then(data=>{
      res.render("home",{username:username,blog:data})
  
    })
  }
  else{
    await mymodel.find({is_draft:"n"}).then(data=>{
      res.render("home",{username:username,blog:data})
  
    })
  }
  

})
app.get("/trending",async(req,res)=>{
  await mymodel.find({is_draft:"n"}).limit(15).sort({score:-1}).then(data=>{
    res.render('trending',{blog:data,username:req.cookies['username']});

    })
})
app.get("/get-trending",async(req,res)=>{
  await mymodel.find().sort({score:-1}).then(data=>{
      
      res.send(data)
  })
})
app.get("/drafts",async(req,res)=>{
  let doc = await mymodel.find({email:req.cookies['email'], is_draft:"y"})
  res.render("drafts",{username:req.cookies['username'],blog:doc})
})
app.get("/create-blog",async(req,res)=>{
  
  res.render("createblog",{username:req.cookies['username']})
})
app.get("/sending-user-for-mention", async(req,res)=>{
  let doc = await usermodel.find({},{username:1})
res.send(doc)
})
app.post("/save-as-draft",async(req,res)=>{
  let ads=""
  // if(req.body.ads !=""){
  //   ads=sanitizeHtml(req.body.ads)
  // }
  ads=req.body.ads
  let d = new Date()
  let s = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
  const data = new mymodel({
    email:req.cookies['email'],
    username:req.cookies['username'],
    is_draft:"y",
    title: req.body.title,
    desc:req.body.desc,
    thumbnail:req.body.thumbnail,
    ads:ads,
    date:s+" "+d.toLocaleTimeString(),
    body:req.body.blog, })
  await data.save()
res.send("done") 

})
app.post("/post-blog",async(req,res)=>{
  let ads=""
  // if(req.body.ads !=""){
  //   ads=sanitizeHtml(req.body.ads)
  // }
  ads=req.body.ads
  let user = await usermodel.find({email:req.cookies['email']})
  let user2 = await usermodel.findById({_id:user[0]._id})

  let d = new Date()
  let s = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
  const data = new mymodel({
          email:req.cookies['email'],
          
          username:user2.username,
          is_draft:"n",
          title: req.body.title,
          desc:req.body.desc,
          thumbnail:req.body.thumbnail,
          ads:ads,
          date:s+" "+d.toLocaleTimeString(),
          body:req.body.blog,
          genre:req.body.genre,
        customid:customId({email:req.cookies['email'],title:req.body.title})
       })
  let doc = await data.save()
  console.log(doc._id)
  await usermodel.findByIdAndUpdate({_id:user2._id},{
    $push:{
      myBlogId:doc._id
    }
  })
res.send("done")

})

app.post("/post-draft",async(req,res)=>{
  let user = await usermodel.find({email:req.cookies['email']})
  let user2 = await usermodel.findById({_id:user[0]._id})
  let ads=""
  // if(req.body.ads !=""){
  //   ads=sanitizeHtml(req.body.ads)
  // }

  ads=req.body.ads
  console.log("post draft "+req.body.id)
  let d = new Date()
  let s = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
  try{
  await mymodel.findOneAndUpdate({"_id":req.body.id},{
      $set:{
          title:req.body.title,
          body:req.body.blog,
          username:req.cookies['username'],
          is_draft:"n",
          desc:req.body.desc,
          ads:ads,
          genre:req.body.genre,
          date:s+" "+d.toLocaleTimeString(),
          thumbnail:req.body.thumbnail,
          genre:req.body.genre,
          customid:customId({email:req.cookies['email'],title:req.body.title})
      }
  })
  await usermodel.findByIdAndUpdate({_id:user2._id},{
    $push:{
      myBlogId:ObjectId(""+req.body.id)
    }
  })
}
catch(error){
console.log(error)
}
res.send("done") 
 
})
app.get('/profile',async(req,res,next) =>{
  try{
      let user = await usermodel.find({email:req.cookies['email']})
      user = await usermodel.findById({_id:user[0]._id})
  let doc = await mymodel.find({email:req.cookies['email'],is_draft:"n"})
  let all_blogs = await mymodel.find({is_draft:"n"})
  let followers = await usermodel.find({username:{$in:user.followers}})
  let following = await usermodel.find({_id:{$in:user.following}})
// console.log(user.followers)
let dp_data=""
if(user.dp.contentType !="" && user.dp.data != undefined){
dp_data = user.dp.data.toString("base64")
// console.log(user.dp.data)
}
res.render('profile',{blog:doc,username:req.cookies['username'],
user:user,userprofile:"yes",followers:followers,following:following,
all_blogs:all_blogs, dp:dp_data});
  }
  catch(error){
console.log(error);
  }
})
app.post("/random", (req,res)=>{
  console.log(req.files.dp)
})
app.post("/add-profile-details",async(req,res)=>{
 let ss;
 let image;
//  console.log(req.files.dp)

  if( req.files == null || req.files == undefined){
   
console.log("empty")
    
   await usermodel.findOneAndUpdate({email:req.cookies['email']},{
      $set:{
    links:{
      linkedin:req.body.linkedin,
      instagram:req.body.instagram,
      github:req.body.github,
      pinterest:req.body.pinterest,
      youtube:req.body.youtube
    },
        about:req.body.about,
        
        name:req.body.name,
        interest:req.body.genre
      }
    },{new:true})
    
    res.redirect("/profile")
  }
  else{
    ss = req.files.dp
  
    if(ss.mimetype == "image/jpeg" ||ss.mimetype == "image/png" || ss.mimetype == "image/jpg" ){
    let s = req.files.dp.data
   
    let base64 = s.toString('base64');
   //  console.log(base64.substr(0,200));
     image = Buffer.from(base64, 'base64');
    let doc = await usermodel.findOneAndUpdate({email:req.cookies['email']},{
      $set:{
        links:{
          linkedin:req.body.linkedin,
          instagram:req.body.insta,
          github:req.body.github,
          pinterest:req.body.pinterest,
          youtube:req.body.youtube
        },
        about:req.body.about,
        dp:{ data: image,
          contentType: ss.mimetype},
        name:req.body.name,
        interest:req.body.genre
      }
    },{new:true})
    console.log(doc.comments_made)
    await mymodel.updateMany({"comment._id":{$in:doc.comments_made}},{
      $set:{
        image:{ data: image,
          contentType: ss.mimetype},
      }
    })
    }
    
    res.redirect("/profile")

  }

 
// res.send("done")
})
app.get("/blog/:id",async(req,res)=>{
  // let doc = await mymodel.findById(req.params.id)
  let doc = await mymodel.find({customid:req.params.id})
  // console.log(doc[0]._id)

  let writer = await usermodel.find({myBlogId:{$in:[ObjectId(doc[0]._id)]}})
  // console.log(writer)
  let dp_data=""
if(writer[0].dp.contentType !="" && writer[0].dp.data != undefined){
dp_data = writer[0].dp.data.toString("base64")
// console.log(user.dp.data)
}

  if(!req.cookies['email']){

res.render("blog",{blog:doc[0],user:"nothing",email:"nothing",username:"nothing"
,writer:writer,dp:dp_data})
  }
  else{
 let user = await usermodel.find({email:req.cookies['email']})
  user = await usermodel.findById({_id:user[0]._id})
  
  res.render("blog",{blog:doc[0],user:user,email:req.cookies['email'],username:req.cookies['username']
  ,writer:writer,dp:dp_data})
  }
})
app.get("/draft_edit/:id",async(req,res)=>{
  let doc = await mymodel.findById(req.params.id)
  res.render("draft_edit",{blog:doc,username:req.cookies['username']})
})
app.post("/draft-edit",async(req,res)=>{
  let ads=""
  if(req.body.ads !=""){
    ads=sanitizeHtml(req.body.ads)
  }
  let d = new Date()
  // console.log(req.body.id)
  let s = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
  try{
 await mymodel.findOneAndUpdate({"_id":req.body.id},{
     $set:{
         title:req.body.title,
         body:req.body.blog,
        
          desc:req.body.desc,
          thumbnail:req.body.thumbnail,
          ads:ads,
          date:s+" "+d.toLocaleTimeString(),
          
     }
 })
 res.send("done") 
}
catch(error){
  console.log(error)
}
  
})
// app.get("/randomblog",(req,res)=>{
//   res.render("blog2",{username:req.cookies['username']})
// })
//com and rep
app.post("/do-comment",async (req,res)=>{
  if(!req.cookies['email']){
    res.redirect("/")
  }
  let d = new Date()
  let s = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
  
  let user = await usermodel.find({email:req.cookies['email']})
let user2 = await usermodel.findById({_id:user[0]._id})
let dp_data =""
let dp_contentType=""
if(user2.dp.data != undefined && user2.dp.contentType !=""){
dp_data = user2.dp.data
dp_contentType=user2.dp.contentType
}
  let doc=await mymodel.findOneAndUpdate({_id: req.body.id},
     {
        $push:{
         comment:{
             username:req.cookies['username'],
             data : req.body.comment,
             date:s+" "+d.toLocaleTimeString(),
             image:{
               data: dp_data,
               contentType: dp_contentType,
             }
         }
        }
     },
     {new:true})
     let score = doc.score
  await mymodel.findOneAndUpdate(
         {  _id: req.body.id },
         {$set:{"score":(score+1)*0.2 }},
         
      )
      user = await usermodel.findByIdAndUpdate({_id:user[0]._id},{
         $push:{comments_made:ObjectId(doc.comment[doc.comment.length - 1]._id)} 
      },{new:true})
     //for notif to the writer
     
     if(req.body.writer != req.cookies['email']){
      //  console.log("sending notif on 299 and "+req.body.writer )
     await usermodel.findOneAndUpdate({username:req.body.writer},{
         $push:{
             notif:{
                 type:"comment",
                 name:user.username,
                 blog:req.body.title
             }
         }
     })
 }
 await usermodel.findOneAndUpdate({email:req.body.writer},{
     $set:{notif_status:1}
 })
    res.send(`done`)
 
 })
 app.post("/do-reply",async (req,res)=>{
     
    //  console.log(`${req.body.cid} and ${req.body.reply}`)
     let user = await usermodel.find({email:req.cookies['email']})
    let user2 = await usermodel.findById({_id:user[0]._id})
     let d = new Date()
  let s = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
  let dp_data =""
  let dp_contentType=""
  if(user2.dp.data != undefined && user2.dp.contentType !=""){
  dp_data = user2.dp.data
  dp_contentType=user2.dp.contentType
  }
     let doc =await mymodel.findOneAndUpdate({"comment._id": req.body.cid},
        {
          $push:{
              "comment.$.reply":{
                  data: req.body.reply,
                  username:req.cookies['username'],
                  date:s+""+d.toLocaleTimeString(),
                  image:{
                    data: dp_data,
                    contentType:dp_contentType
              }
            }
         } },
         {new:true})
         //doc.comment.reply.length doesn't work, so how to know the number of replies?
         let score = doc.score
         await mymodel.findOneAndUpdate(
             {  _id: req.body.id },
             {$set:{"score":(score+1)*0.2 }},
             
          )
         
         let i=0
         doc.comment.every(com=>{
             
             if(com._id == req.body.cid){
                 return i
             }
             i++
         })
         console.log(doc.comment[i].reply.length)
         console.log(doc.comment[i].reply[doc.comment[i].reply.length - 1]._id)
         user = await usermodel.findByIdAndUpdate({_id:user[0]._id},{
             $push:{
                 comments_made:ObjectId(doc.comment[i].reply[doc.comment[i].reply.length - 1]._id)
             }
         })
        
         res.send("replied")
 })
 app.post("/do-like",async(req,res)=>{
   
   if(req.body.email === "nothing"){
      
    res.send("redirect")
  }
  else{
      await mymodel.findOneAndUpdate(
         {  _id: req.body.data },
         {$set:{"comment.$[outer].reply.$[inner].likes":req.body.likes}},
         {"arrayFilters":[{"outer._id":req.body.cid},{"inner._id":req.body.rid}]}
      )
      
      if(req.body.flag==1){
          console.log("flag is 1")
         await usermodel.findOneAndUpdate({email : req.body.email},
             {$push:{"liked_comments":req.body.rid
                      
                 }})
          }
     else{
         await usermodel.findOneAndUpdate({email : req.body.email},
             {$pull:{"liked_comments":req.body.rid
                     
                 }})
     }
         res.send("likes")
    }
 
 })
 app.post("/comments-like",async(req,res)=>{
  if(req.body.email === "nothing"){
      
    res.send("redirect")
  }
  else{
     await mymodel.findOneAndUpdate({_id:req.body.data},
         {$set:{"comment.$[outer].likes":req.body.likes}},
         {"arrayFilters":[{"outer._id":req.body.cid}]}
         )
     let user = await usermodel.find({email:req.cookies['email']})
     
         if(req.body.flag==1){
             await usermodel.findByIdAndUpdate({_id:user[0]._id},
                 {$push:{
                     liked_comments:req.body.cid
            }})
         
         }
         
         else{
             await usermodel.findByIdAndUpdate({_id:user[0]._id},
                 {$pull:{
                          liked_comments:req.body.cid
                 }})
         }
        
         res.send("comment liked")
        }
 })
 
 app.post("/post-edited-comment", async(req,res)=>{
    
     
     await mymodel.findOneAndUpdate({_id:req.body.data},
         {$set:{"comment.$[outer].data":req.body.comment}},
         {"arrayFilters":[{"outer._id":req.body.cid}]}
         )
     
     res.send("edited")
 })
 app.post("/post-edited-reply", async(req,res)=>{
    
     
     await mymodel.findOneAndUpdate({_id:req.body.data},
         {$set:{"comment.$[outer].reply.$[inner].data":req.body.comment}},
         {"arrayFilters":[{"outer._id":req.body.cid},{"inner._id":req.body.rid}]}
         )
     
     res.send("edited reply")
 })
 app.post("/delete-com",async(req,res)=>{
     await mymodel.findOneAndUpdate({_id:req.body.blog_id},
         {
             $pull:{"comment":{_id:req.body.cid}}
         })
         let i=0
         let user = await usermodel.find({email:req.cookies['email']})
         let doc = await usermodel.findById({_id:user[0]._id})
    
     doc.comments_made.every(id=>{
         if(id == req.body.cid){
             return i
         }
         i++
     })
     doc.comments_made.splice(i,1)
      await usermodel.findByIdAndUpdate({_id:user[0]._id},
         {
             $set:{comments_made:doc.comments_made}
         })
    
   
     res.send("deleted")
 })
 app.post("/delete-reply", async(req,res)=>{
     await mymodel.findOneAndUpdate({_id:req.body.blog_id},
         {$pull:{"comment.$[outer].reply":{_id:req.body.rid}}},
         {"arrayFilters":[{"outer._id":req.body.cid}]}
         )
         let user = await usermodel.find({email:req.cookies['email']})
         let doc = await usermodel.findById({_id:user[0]._id})
         let i=0
        //  console.log(doc.comments_made)
         doc.comments_made.forEach(id=>{
             // console.log(`${id} and ${req.body.rid}`)
             if(id == req.body.rid){
                 console.log(`${id} and ${req.body.rid}`)
                 return i
             }
             i++
         })
         console.log(`is is ${i}`)
         doc.comments_made.splice(i,1)
         await usermodel.findByIdAndUpdate({_id:user[0]._id},
             {
                 $set:{comments_made:doc.comments_made}
             })
       
         res.send("deleted")
 })
 app.post("/blog-like",async(req,res)=>{
   
    if(req.body.email === "nothing"){
      
      res.send("redirect")
    }
    else{
     await mymodel.findOneAndUpdate({"_id":req.body.id},
     {
         $set:{"score":(req.body.value + 1)*0.2,"blog_likes": req.body.value}
     })
     if(req.body.flag == 1){
     await usermodel.findOneAndUpdate({email:req.body.email},{
        $push:{liked_blogs:req.body.id} 
     })
 }
 else{
     await usermodel.findOneAndUpdate({email:req.body.email},{
         $pull:{liked_blogs:req.body.id} 
      })
 }
 res.send("blog liked")
}
 })
 app.post("/bookmark",async(req,res)=>{
  
   if(!req.cookies['email']){
     res.send("redirect")
   }
   else{
  if(req.body.flag==0){
      await usermodel.findOneAndUpdate({email:req.cookies['email']},{
          $push:{
              bookmark:req.body.blog
          }
      })
      res.send("done")
  }
  if(req.body.flag==1){
      await usermodel.findOneAndUpdate({email:req.cookies['email']},{
          $pull:{
              bookmark:req.body.blog
          }
      })
      res.send("done")
  }
   }
})
app.post("/follow",async(req,res)=>{
  if(!req.cookies['email'] || req.cookies['email']==undefined){
    
    res.send("redirect")
  }
  else{
  console.log("follow")
  let user = await usermodel.find({email:req.cookies['email']})
  let user2 = await usermodel.find({email:req.cookies['email']})
  user = await usermodel.findById({_id:user[0]._id})
 
 console.log(req.body.uid)
  await usermodel.findByIdAndUpdate(req.body.uid,{
      $push:{
          notif:{
              type:"follow",
              name:user.username,
          }
      }
  })
  await usermodel.findByIdAndUpdate(req.body.uid,{
      $set:{notif_status:1}
  })
  await usermodel.findByIdAndUpdate(user2[0]._id,{
      $push:{
          following:req.body.uid
      }
  })
  await usermodel.findOneAndUpdate({_id:req.body.uid},{
      $push:{
          followers:user.username,
          
      }
  })
  
  res.send("done")
}
})
app.post("/unfollow", async(req,res)=>{
  console.log("unfollow")
  let user = await usermodel.find({email:req.cookies['email']})
  let user2 = await usermodel.find({email:req.cookies['email']})
  user = await usermodel.findById({_id:user[0]._id})
 
 console.log(req.body.uid)
  
  await usermodel.findByIdAndUpdate(user2[0]._id,{
      $pull:{
          following:req.body.uid
      }
  })
  await usermodel.findOneAndUpdate({_id:req.body.uid},{
      $pull:{
          followers:user.username,
          
      }
  })
  
  res.send("done")
})
app.post("/search-on-homepage", async(req,res)=>{
  if((req.body.filter)=="blog"){
      // console.log("dfkjnlfnd")
  await mymodel.find({title:{$regex:req.body.data}, is_draft:"n"}).then(data=>{
    // console.log(data[0].title +" "+data[0].customid)
      res.send(data)
  })
}
else if(req.body.filter == "genre"){
  await mymodel.find({genre:{$regex:req.body.data}}).then(data=>{
    // console.log(data[0].title +" "+data[0].customid)
      res.send(data)
  })
}
else{
  await usermodel.find({username:{$regex:req.body.data},verif:"yes"}).then(data=>{
      res.send(data)
  })
}
})
app.get("/genre/:id",async(req,res)=>{
  let doc = await mymodel.find({genre:req.params.id})
  res.render("tags",{blog:doc,tag:req.params.id,username:req.cookies['username']})
})
app.get("/edit-blog/:id",async(req,res)=>{
  let doc = await mymodel.findById(req.params.id)
  let user=""
  if(!req.cookies['username']){
    user="nothing"
  }
  else{
    user= req.cookies['username']
  }
  res.render("postblogedit",{blog:doc,username:user})
})
app.post("/delete-blog",async(req,res)=>{
  await mymodel.deleteOne({_id:req.body.id})
  res.send("done")
})
app.get("/chat",async(req,res)=>{
  let user=""
  if(!req.cookies['username'] || req.cookies['username']==undefined){
    res.redirect("/")
  }
  else{
    user= req.cookies['username']
  res.render("chat",{username:user,email:req.cookies['email']})

  }
})
app.get("/notification",async(req,res)=>{
  let user=""
  if(!req.cookies['username']){
    user="nothing"
  res.render("notif",{username:user})

  }
  else{
    user= req.cookies['username']
    let user2 = await usermodel.find({email:req.cookies['email']})
    user2 = await usermodel.findById({_id:user2[0]._id})
  res.render("notif",{username:user,user:user2})

  }

})
app.post("/get-notif-status",async(req,res)=>{
  let doc = await usermodel.find({email:req.cookies['email']})
 if(doc.length>0){

let str= ""+doc[0].notif_status
res.send(str)
 }
})
app.post("/set-notif-status",async(req,res)=>{
  await usermodel.findOneAndUpdate({email:req.cookies['email']},{
              $set:{notif_status:0}
          })
})
app.get("/profile/:id", async(req,res)=>{
  // console.log("this is"+req.cookies['email'])
  // let user = await usermodel.findById(req.params.id)
  let user = await usermodel.find({username:req.params.id})
  // console.log(user)

    if(req.cookies['username'] == req.params.id){
      res.redirect("/profile")
    }
    else{
      let username=""
      console.log("FOR PROFILE")
      if(!req.cookies['username']){
        username="nothing"
        
      }
      else{
        username= req.cookies['username']
      }
      console.log("username for profile is "+username)

      let blogs = await mymodel.find({email:user[0].email, is_draft:"n"})
      // console.log(blogs)
      let doc = await usermodel.find({email:req.cookies['email']})
      let dp_data=""
if(user[0].dp.contentType !="" && user[0].dp != undefined && user[0].dp.data != undefined ){
dp_data = user[0].dp.data.toString("base64")
// console.log(user.dp.data)
}
      // console.log(user[0]._id)
  res.render('profile2',{me:doc,name:req.cookies['email'],
  userprofile:user[0],username:username,blog:blogs,dp:dp_data});
      }
    
})
app.post("/delete-chat",async(req,res)=>{
  try{
  await chat_model.deleteOne({roomID:req.body.roomID})
  res.send("done")
  }
  catch(error){
      console.log(error)
  }
})
app.post("/send-msg", async(req,res)=>{
  console.log(`isread is ${req.body.isRead}`)
  let flag=true
  if(req.body.isRead == 1){
      flag=false
  }
  let d = new Date()
  let s = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
  
  // let flag = false
await chat_model.findOneAndUpdate({roomID:req.body.roomID},{
    
    $push:{
        chats:{username:req.body.sender,data:req.body.msg,isRead:flag,date:s+" "+d.toLocaleTimeString()}
    }
})
res.send("done")
})
app.post("/get-unread", async (req,res)=>{
  let doc = await chat_model.find({
      $or:[{sender:req.body.sender},{receiver:req.body.sender}], chats:{$elemMatch:{isRead:false}}
  })
  let rooms =[]
  doc.forEach(doc=>{
      doc.chats.forEach(chat=>{
          if(chat.username != req.body.sender & chat.isRead != true){
              rooms.push(doc.roomID)
          }
      })
  })
  res.send(rooms)
  //console.log(rooms)
})
app.post("/get-chats", async(req,res)=>{
  let doc = await chat_model.find({roomID:req.body.roomID})
  doc.forEach(res=>{
     res.chats.forEach(async(chat)=>{

         await chat_model.findOneAndUpdate({roomID:req.body.roomID},
                     {$set:{"chats.$[outer].isRead":"true"}},
                     {"arrayFilters":[{"outer._id":chat._id}]}
                     )
        
     })
  })
 
   res.send(doc)
 })
 app.post("/get-room-id", async(req,res)=>{
  // console.log(req.body.r)
  let roomID=""
  let user = await usermodel.find({username:req.body.r})
  if(user.length >0){
  let doc = await chat_model.find({$or:[{sender:req.body.sender,receiver:req.body.r},{sender:req.body.r,receiver:req.body.sender}]})
  if(doc.length == 0){
   roomID = customId({
    sender: req.body.sender,
    receiver: req.body.r
  })
  const data = new chat_model({
      roomID:roomID,
      sender:req.body.sender,
    receiver: req.body.r,

  })

  data.save()
}
else{
  roomID = doc.roomID
}
  res.send(roomID)
}
  })
app.post("/get-my-senders", async(req,res)=>{
    console.log(req.body.sender)
//  let doc = await chat_model.find({$or:[{sender:req.body.sender},{receiver:req.body.sender}]})
let doc = await chat_model.find({$or:[{receiver:req.body.sender},{sender:req.body.sender}]})
//  console.log(doc)

 res.send(doc)
})
app.post("/get-chats", async(req,res)=>{
 let doc = await chat_model.find({roomID:req.body.roomID})
 doc.forEach(res=>{
    res.chats.forEach(async(chat)=>{

        await chat_model.findOneAndUpdate({roomID:req.body.roomID},
                    {$set:{"chats.$[outer].isRead":"true"}},
                    {"arrayFilters":[{"outer._id":chat._id}]}
                    )
       
    })
 })

  res.send(doc)
})
app.post("/search", async(req,res)=>{
    
  await usermodel.find({username:{$regex:req.body.data}},{verif:"yes"}).then(data=>{
     
      res.send(data)
  })

})
app.post("/delete-notif",async(req,res)=>{
   await usermodel.findOneAndUpdate({email:req.cookies['email']},{
     $set:{
       notif:[]
     }
   })
  res.send("done")
})
app.post("/delete-acc",async(req,res)=>{
  let user = await usermodel.findById({_id:req.body.uid})
  await mymodel.deleteOne({_id:{$in:user.myBlogId}})
  await usermodel.updateMany({
    $pull:{bookmark:{$in:user.bookmark}}
  })
  await usermodel.updateMany({
    $pull:{
      followers:req.cookies['username']
    }
  })
 await usermodel.deleteOne({_id:req.body.uid})
 await chat_model.deleteMany({$or:[{sender:user.username}, {receiver:user.username}]})
  res.send("done")
})
app.post("/blog-views", async(req,res)=>{
  let doc = await mymodel.findById({_id:req.body.blog})
  if(doc.email != req.cookies['email']){
  await mymodel.findByIdAndUpdate({_id:req.body.blog},{
    $set:{
      blog_views:doc.blog_views+1,
      score:(doc.score+1)*0.4
    }
  })
}
})
app.get("/chats2",(req,res)=>{
  res.render("chat2",{username:req.cookies['username'],email:req.cookies['email']})
})

io.on("connection",(socket)=>{
  socket.on("join-room",data=>{
      if(data.prev_room != "nothing"){
      socket.leave(data.prev_room)
      console.log("left "+data.prev_room)
      }
    socket.join(data.room)
    console.log("joined room"+data.room)
    
  })
 socket.on("get-clients-no",room=>{
     let clientNumber = io.sockets.adapter.rooms.get(room).size
     console.log(clientNumber)
     socket.emit("get-clients-no",clientNumber)
 })
   socket.on("express-chat",data=>{
       
      let d = new Date()
      let s = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
     socket.to(data.roomID).emit("express-chat",{data:data, t:s+" "+d.toLocaleTimeString()})
     console.log("im here" + data)
   })
  //  socket.on('disconnect',()=>{
  //      console.log("disconnected")
  //  })
   
 
 })
 