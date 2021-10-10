let login = document.getElementById("login")
let login_btn = document.getElementById("login_btn")
let register = document.getElementById("register")
let signup = document.getElementById("signup_btn")
let signup_div = document.getElementById("signup_div")
signup_div.style.display="none"
let login_div = document.getElementById("login_div")
let forgot_div = document.getElementById("forgot_div")
forgot_div.style.display="none"
let forgot_btn = document.getElementById("forgotpassword")

login_btn.addEventListener("click",()=>{
  let email=$("input[name='email']").val()
  let pass= $("input[name='password']").val()
  // alert("clicked")
  $.ajax({
      url:"/login-user",
      method:"POST",
      data:{email:email,password:pass},
      success:function(res){
        if(res=="incorrect"){
          $("#password_login_p").html("Incorrect email ID or password")
        }
        else{
          window.location.href="/home"
        }
      }
      
  });
})
register.addEventListener("click",()=>{
  let email=$("input[name='email_signup']").val()
  let pass= $("input[name='password_signup']").val()
  let username = $("input[name='username_signup']").val()
  let cp =$("input[name='cp']").val()
  
  
  if(cp==pass){
  $.ajax({
      url:"/signup-user",
      method:"POST",
      data:{email:email,password:pass,username:username,cp:cp},
      success:function(res){
        if(res=="email"){
          $("#cp_p").html("User already exists. Please login to continue")
        }
        else if(res=="user"){
          $("#cp_p").html("This username is taken. Please try again")

        }
        else if(res=="done"){
          // window.location.href="/home"
          $("#cp_p").html("Verification link sent")

        }
      }
  })
}
else{
  $("#cp_p").html("Passwords do not match")
}

}) 
login.addEventListener("click",()=>{
  login_div.style.display="block"
    signup_div.style.display ="none"
})
signup.addEventListener("click",()=>{
    login_div.style.display="none"
    signup_div.style.display ="block"
})
forgot_btn.addEventListener("click",()=>{
  login_div.style.display="none"

  forgot_div.style.display="block"
  
})
let forgot_submit = document.getElementById("forgot_btn")
let message = document.getElementById("message_forgot")
forgot_submit.addEventListener("click",()=>{
  let email = $("input[id='email_forgot']").val()
  $.ajax({
    url:"/forgot-password",
    method:"POST",
    data:{email:email},
    success:function(res){
      if(res=="sent"){
        message.innerHTML = "Recovery email has been sent to the above email ID"

      }
    }
  })
})