const email = $("input[name='email']").val()

const bookmark =(btn)=>{

if(btn.innerHTML == '<i class="fas fa-bookmark"></i>'){
    $.ajax({
        url:"/bookmark",
        method:"POST",
        data:{blog:btn.id, flag:1},
        success:function(res){
            if(res=="redirect"){
                window.location.href="/"
            }
            else{
            btn.innerHTML = '<i class="far fa-bookmark"></i>'
            }
        }
    })
}
if(btn.innerHTML == '<i class="far fa-bookmark"></i>'){
    $.ajax({
        url:"/bookmark",
        method:"POST",
        data:{blog:btn.id,flag:0},
        success:function(res){
            if(res=="redirect"){
                window.location.href="/"
            }
            else{
            btn.innerHTML = '<i class="fas fa-bookmark"></i>'
            }
        }
    })
}
    
}
const edit_blog =(btn)=>{

window.location.href="/edit_post/"+btn.id
}
const blog_likes = (btn)=>{
const notliked ='<i class="far fa-thumbs-up" ></i>'
const liked = '<i class="fas fa-thumbs-up" ></i>'
let value=0
let flag=0
if(btn.className == "active"){
  
btn.innerHTML = notliked
flag=0
value = +$("label[for='"+btn.name+"']").text() - +1
   $("label[for='"+btn.name+"']").html(value)
   btn.classList.remove("active")
}
else{

btn.innerHTML = liked
flag=1
value = +$("label[for='"+btn.name+"']").text() + +1
   $("label[for='"+btn.name+"']").html(value)
   btn.classList.add("active")
}

$.ajax({
  url:"/blog-like",
  method:"POST",
  data:{id:btn.id,email:email,flag:flag,value:value},
  success:function(response){
      if(response == "redirect"){
          window.location.href="/"
      }
  }
})

}
//DELETING COMMENT 
const delete_com = (btn)=>{
   const blog_id = $(btn).attr('data-cmd')
   const cid = $(btn).attr('data-com')
   
   
   $.ajax({
       url:"/delete-com",
       method:"POST",
       data:{blog_id:blog_id,cid:cid,email:email},
       success:function(response){
           
            window.location.reload(true)
       }
   })
}
const delete_reply = (btn)=>{
const blog_id = $(btn).attr('data-cmd')
   const cid = $(btn).attr('data-com')
   
const rid = btn.id
   $.ajax({
       url:"/delete-reply",
       method:"POST",
       data:{blog_id:blog_id,cid:cid,email:email,rid:rid},
       success:function(response){
           
           window.location.reload(true)


       }
   })
}
const cancel =(btn)=>{
   let id = btn.id.replace("cancel","")
   $("#"+id+"cancel").toggle()
   $("#"+id+"send").toggle()
   $("#"+id+"edit").toggle()
   $("#"+id+"comment").attr('readonly',true)
   window.location.reload(true)
   
}
const edit_comment = (btn)=>{
   let id = btn.id.replace("edit","")
   btn.style.display = "none"
   $("#"+id+"send").toggle()
   $("#"+id+"cancel").toggle()
   $("#"+id+"comment").attr('readonly',false)
}
const post_edit_comment = (btn)=>{
   
let id = btn.id.replace("send","")

let t = $("#"+id+"comment").val()
const data = $(btn).attr("data-cmd")
id= id
$.ajax({
    url:"/post-edited-comment",
    method:"POST",
    data:{cid:id,comment:t,data:data},
    success:function(res){
        
        window.location.reload(true)
           

    }
})
}
const post_edit_reply = (btn)=>{
   
   let id = btn.id.replace("send","")

   let t = $("#"+id+"comment").val()
 const data = $(btn).attr("data-cmd")
 const cid = $(btn).attr("data-com")
   id= id
   $.ajax({
       url:"/post-edited-reply",
       method:"POST",
       data:{rid:id,cid:cid,comment:t,data:data},
       success:function(res){
           
           window.location.reload(true)
           

       }
   })
  }
const post_data = (form)=>{    
    let writer= $("h5[name='writer']").html()
    writer = writer.substring(1)
    $.ajax({
        url: "/do-comment",
        data:{comment: form.comment.value,id:form.id.value,
            
            writer:writer,
            title:$("h2[name='title']").html()
        },
        method: "POST",
        success: function(response){
            
            window.location.reload(true)
           

        }
    })
    return false
}

let btn = document.getElementsByClassName("reply")
for(let i=0;i<btn.length;i++){
  btn[i].addEventListener("click",()=>{
      
      $("#"+btn[i].id+"d").toggle()
  })
}
const post_reply = (form)=>{
    
    $.ajax({
        url: "/do-reply",
        data:{reply: form.reply.value,id:form.id.value,cid:form.cid.value},
        method: "POST",
        success: function(response){
            
            window.location.reload(true)

        }
    })

    return false
}


const change_likes = (btn)=>{


const notliked ='<i class="far fa-thumbs-up" ></i>'
const liked = '<i class="fas fa-thumbs-up"></i>'
let value=0
let liked_by_user=0
if(btn.className == "active"){
  
  liked_by_user=0
btn.innerHTML = notliked
value = +$("label[for='"+btn.name+"']").text() - +1
   $("label[for='"+btn.name+"']").html(value)
   btn.classList.remove("active")
  
}
else{

btn.innerHTML = liked
liked_by_user=1
value = +$("label[for='"+btn.name+"']").text() + +1
   $("label[for='"+btn.name+"']").html(value)
   btn.classList.add("active")
}


  
  const data = $(btn).attr("data-cmd")
  const cid = $(btn).attr("data-com")
    

  
  $.ajax({
    url: "/do-like",
        data:{rid: btn.name,cid:cid,likes:value,data: data,
        email:email,flag:liked_by_user},
        method: "POST",
        success: function(response){
            if(response=="redirect"){
                window.location.href = "/"
            }
        }
  })
    
   
}
//comment_likes
const comment_likes =(btn)=>{

const notliked ='<i class="far fa-thumbs-up" ></i>'
const liked = '<i class="fas fa-thumbs-up" ></i>'
let value=0
let flag=0
if(btn.className == "active"){
  
btn.innerHTML = notliked
flag=0
value = +$("label[for='"+btn.name+"']").text() - +1
   $("label[for='"+btn.name+"']").html(value)
   btn.classList.remove("active")
}
else{

btn.innerHTML = liked
flag=1
value = +$("label[for='"+btn.name+"']").text() + +1
   $("label[for='"+btn.name+"']").html(value)
   btn.classList.add("active")
}
const data = $(btn).attr("data-cmd")


$.ajax({
    url: "/comments-like",
        data:{cid: btn.name,likes:value,data: data, email:email,
             flag:flag},
        method: "POST",
        success: function(response){
            if(response=="redirect"){
                window.location.href = "/"
            }
        }
  })


}

window.onload =()=>{
    let writer= $("h5[name='writer']").html()
    writer = writer.substring(1)
    if($("#hidden_user").val() != writer){
        
        $.ajax({
            url:"/blog-views",
            method:"POST",
            data:{blog:$("input[name='id']").val()},

        })
    }
}
