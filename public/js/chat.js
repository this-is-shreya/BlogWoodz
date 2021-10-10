let sender = $("input[name='sender']").val()
const search2 =()=>{
  let search_div = document.getElementById("receiver_search")
  let search_item = $("input[name='r']").val()
  $.ajax({
    url:"/search",
    method:"POST",
    data:{data:search_item},
    success:function(response){      
      if(response!=null){
        response.forEach(res=>{
          let anchor = document.getElementsByClassName('user-suggestion')
          let flag =0
          for(let i=0;i<anchor.length;i++){
            if(anchor[i].innerText == res.username){
              flag=1
            }
          }
          if(flag!=1 && res.username!=sender){
            let btn = document.createElement('button')
            btn.classList.add("user-suggestion")
            btn.innerHTML = res.username
            btn.onclick =function(){
              document.getElementById("r").value = btn.innerHTML
              //ADDED HERE
              search_div.innerHTML=''
              //ADDED HERE
              search_div.classList.add('hidden')
            }
            //ADDED HERE
            search_div.classList.remove('hidden')
            $("#receiver_search").append(btn)
            let linebreak = document.createElement('br')
            $("#receiver_search").append(linebreak)
          }
        })
      } 
      
      if( search_item.length ==0){
        search_div.innerHTML =''
        search_div.classList.add('hidden')
      }
    }
  })
}

// const socket = io.connect()
const socket = io()
let chat_div = document.getElementById("chat")
socket.on("express-chat",data=>{
  //ADDED HERE
  chat_div.innerHTML = '<div style="text-align:left;"><div class="msg-bubble-receiver"><p style="margin:0;">'+data.data.msg+'<br><span style="font-size:10px;color:grey;">'+data.t+'</span></p></div></div>' + chat_div.innerHTML;
})
     
const show_notif2=()=>{
  let sender = $("input[name='sender']").val()
  $.ajax({
    url: "/get-unread",
    method:"POST",
    data:{sender:sender},
    success:function(rooms){
      rooms.forEach(room=>{
        let btn = document.getElementById(room)
        if(btn){
          let span_div ="<span class='badge'>1</span>"
          if(!btn.innerHTML.includes("*") && $("#"+room).attr("class") != "active_room"){
            btn.innerHTML += " *"           
          }
        }
      })
    }
  })
}

setInterval(show_notif2,3000)

//GET SENDERS
const get_senders2 =()=>{
  document.getElementById("users").innerHTML =""
  $.ajax({
    url:"/get-my-senders",
    method:"POST",
    data:{sender:sender},
    success:function(res){

      res.forEach(res=>{
        if(res.roomID!=undefined){
          let btn = document.createElement('button')
          btn.className += "chat-with"
          btn.id = res.roomID
          if(res.sender == sender){
            btn.innerHTML =""+res.receiver
          }
          if(res.receiver == sender){
            btn.innerHTML =""+res.sender
          }
          btn.onclick = function(){
            //ADDED HERE
            document.getElementById("send-message").classList.remove("hidden")
            //ADDED HERE
            document.getElementById("receiver-name").classList.remove("hidden")
            let del = document.getElementsByClassName("delete")
            del[0].id = btn.id
            let cur_room = document.getElementsByClassName("active_room")
            if(cur_room.length>0){
              socket.emit("join-room",{room:btn.id, prev_room: cur_room[0].id})
              cur_room[0].classList.remove("active_room")
            }
            else{
              socket.emit("join-room",{room:btn.id, prev_room: "nothing"})
            }
            document.getElementById(btn.id).classList.add("active_room")
            let send_btn = document.getElementsByClassName("send")
            send_btn[0].id = btn.id
            chat_div.innerHTML =""
            if(btn.innerHTML.includes(" *")){
              let a = btn.innerHTML
              a = a.replace(" *","")
              btn.innerHTML = a
            }
            let val = ""+btn.innerHTML
            $("label[for='receiver']").html(val)
            //AJAX
            $.ajax({
              url:"/get-chats",
              method:"POST",
              data:{roomID:btn.id},
              success:function(data){
                (data).forEach(msg=>{
                  //ADDED HERE
                  for(let i=msg.chats.length-1;i>=0;i--){
                    if(msg.chats[i].data != undefined){
                      if(msg.chats[i].username == sender){
                        //ADDED HERE
                        chat_div.innerHTML += '<div style="text-align:right;"><div class="msg-bubble-sender"><p style="margin:0;">'+msg.chats[i].data+'<br><span style="font-size:10px;color:grey;">'+msg.chats[i].date+'</span></p></div></div>'
                      }
                      if(msg.chats[i].username != sender){
                        //ADDED HERE
                        chat_div.innerHTML += '<div style="text-align:left;"><div class="msg-bubble-receiver"><p style="margin:0;">'+msg.chats[i].data+'<br><span style="font-size:10px;color:grey;">'+msg.chats[i].date+'</sub></p></div></div>'
                      }
                    }
                  }
                })
              }
            }) 
          }
          if(res.sender != sender && res.chats.length!=0 ){
            //ADDED HERE
            let linebreak = document.createElement("br")
            document.getElementById("users").prepend(linebreak)
            document.getElementById("users").prepend(btn)
          }
          else if(res.sender == sender){
            //ADDED HERE
            let linebreak = document.createElement("br")
            document.getElementById("users").prepend(linebreak)
            document.getElementById("users").prepend(btn)
          }
        }
      }
    )}
  })
}

window.onload = get_senders2()
 
const create_new_chat2 =()=>{ 
  let receiver = $("input[name='r']").val() 
  $.ajax({
    url:"/get-room-id",
    method:"POST",
    data:{sender:sender,r:receiver},
    success:function(id){
      // alert("create new chat")
      window.location.href = window.location
    }
  })
}

const on_post2 =(btn)=>{  
  let receiver = $("label[for='receiver']").html()
  let msg = $("input[name='input msg']").val()  
  // alert(sender + '->' + receiver)

  socket.emit("get-clients-no",btn.id)
  socket.once("get-clients-no",data=>{
    $.ajax({
      url:"/send-msg",
      method:"POST",
      data:{msg:msg,sender:sender,roomID:btn.id, receiver:receiver,isRead:data},
      success:function(res){
        $("input[name='input msg']").val("")
      }
    })

  }) 
  socket.emit("express-chat",{roomID:btn.id,msg:msg})
  // $("input[name='input msg']").val('')
  let d = new Date()
  let s = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
  //ADDED HERE
  chat_div.innerHTML = '<div style="text-align:right;"><div class="msg-bubble-sender"><p style="margin:0;">'+msg+'<br><span style="font-size:10px;color:grey;">'+s+' '+d.toLocaleTimeString()+'</span></p></div></div>' + chat_div.innerHTML; 
}

const show_chat2 =()=>{
  let send_btn = document.getElementsByClassName("send")
  let btn = send_btn[0]  
  let i=0
  $.ajax({
    url:"/get-chats",
    method:"POST",
    data:{roomID:btn.id},
    success:function(data){
      // alert("show chat")
      (data).forEach(msg=>{
        //ADDED HERE
        for(let i=msg.chats.length-1;i>=0;i--){
          if(msg.chats[i].data != undefined){
            if(msg.chats[i].username == sender){
              //ADDED HERE
              chat_div.innerHTML += '<div style="text-align:right;"><div class="msg-bubble-sender"><p style="margin:0;">'+msg.chats[i].data+'<br><span style="font-size:10px;color:grey;">'+msg.chats[i].date+'</span></p></div></div>'
            }
            if(msg.chats[i].username != sender){
              //ADDED HERE
              chat_div.innerHTML += '<div style="text-align:left;"><div class="msg-bubble-receiver"><p style="margin:0;">'+msg.chats[i].data+'<br><span style="font-size:10px;color:grey;">'+msg.chats[i].date+'</sub></p></div></div>'
            }
          }
        }
      })
    }
  })
}
 
const delete_chat2 =(btn)=>{
  $.ajax({
    url:"/delete-chat",
    method:"POST",
    data:{roomID:btn.id},
    success:function(){
      // alert("delete chat")
     window.location.href = window.location
    }
  })
}