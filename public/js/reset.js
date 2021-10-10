

let msg = document.getElementById("message")
let win = window.location +""
let i = win.indexOf(".com/reset/")
win = win.substring(i+11)
let btn = document.getElementById("btn")
// alert(win)
btn.addEventListener("click",()=>{
    let password = $("input[name='password']").val()
let cp = $("input[name='cp']").val()
    if(cp== password){
        // alert(cp +"and "+password+" id-> "+win)
        $.ajax({
            url:"/reset-password",
            method:"POST",
            data:{password:cp,id:win},
            success:function(res){
                window.location.href ="/"
            }
        })
    }
    else{
        msg.innerHTML ="Passwords do not match"
    }
})
