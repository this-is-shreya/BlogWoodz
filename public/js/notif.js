let ele2 = document.getElementsByClassName("notif_link")
ele2[0].classList.add("active")
$("#clear").on("click",()=>{
    $.ajax({
        url:"/delete-notif",
        method:"POST",
        success:function(){
            window.location.href=window.location
        }
    })
})
$.ajax({
    url:"/set-notif-status",
    method:"POST",
    success:function(res){
document.getElementById("badge").innerHTML=""

    }
    
})