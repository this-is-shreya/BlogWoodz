
if(!("" + window.location).includes("/profile/") ){
let ele2 = document.getElementsByClassName("profile_link")
if(ele2[0]){
ele2[0].classList.add("active")
}
}
$("#edit_btn").on("click",()=>{
    $("#editprofile").toggle()
})
$("#bookmarks_btn").on("click",()=>{
    $("#bookmarks").toggle()
})
// $("#save").on("click",()=>{
//     let interest = []
//     let checkbox = document.getElementsByClassName("c")
//     for(let i=0;i<checkbox.length;i++){
//         if(checkbox[i].checked){
//             interest.push(checkbox[i].value)
//         }
//     }
   
    
//     let name = document.getElementById("name").value
//     let dp = document.querySelector('input[type=file]')['files'][0];
//     let github = document.getElementById("Github").value
//     let pinterest = document.getElementById("Pinterest").value
//     let insta = document.getElementById("Instagram").value
//     let linkedin = document.getElementById("LinkedIn").value
//     let youtube = document.getElementById("Youtube").value
//     let about = document.getElementById("About").value
// console.log(dp)
// if(dp == undefined){
//     dp="empty"
// }
// // var formdata = new FormData()
// // formdata.append("dp",dp)
// // $.ajax({
// //     url:"/random",
// //     method:"POST",
// //     data:{dp:dp},
// //     success:function(){
// //         alert("done")
// //     },
// //     cache: false,
// //   contentType: 'application/json',
// //   processData: false,
// // })

// // alert(name + github+ pinterest+insta+linkedin+youtube+about)
   
// $.ajax({
//         url:"/add-profile-details",
//         method:"POST",
//         dataType: 'json',
//         data:{name:name,
//         about:about,interest:interest,dp:dp, instagram:insta,linkedin:linkedin,
//     github:github,pinterest:pinterest,youtube:youtube},
//         success:function(){
//             window.location.href=window.location
//         },
//             cache: false,
//           contentType: 'application/json',
//           processData: false,
//     })
// })
let btn = document.getElementById("follow")
if(btn){
btn.addEventListener("click",()=>{
    if(btn.innerHTML == "Follow"){
    $.ajax({
        url:"/follow",
        method:"POST",
        data:{uid:$("input[name='uid']").val()},
        success:function(res){
            if(res=="redirect"){
                window.location.href="/"
            }
            else{
           btn.innerHTML="Following"
            }
        }
    })
}
else{
    $.ajax({
        url:"/unfollow",
        method:"POST",
        data:{uid:$("input[name='uid']").val()},
        success:function(res){
           btn.innerHTML="Follow"
        }
    })
}
})
}
$("#deleteacc").on("click",()=>{
    $.ajax({
        url:"/delete-acc",
        method:"POST",
        data:{uid:$("input[name='userid']").val()},
        success:function(){
            window.location.href="/"
        }
    })
})
if(document.getElementById("followers")){
let followers = document.getElementById("followers")
followers.addEventListener("click",()=>{
    $(".followers_div").toggle()
})
}
if(document.getElementById("following")){
let following = document.getElementById("following")
following.addEventListener("click",()=>{
    $(".following_div").toggle()
})
}

