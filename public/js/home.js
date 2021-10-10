$("#svg_head").fadeIn("slow")
  
$.ajax({
    url:"/get-notif-status",
    method:"POST",
    data:{flag:1}
})

var i = 0;
var j=0;
var txt = 'Our Picks For You';
var speed = 50;
var heading = 'Welcome To BlogWoodz!'
const typeWriter = ()=> {
if (i < heading.length ) {
document.getElementById("head").innerHTML += heading.charAt(i);
i++;
setTimeout(typeWriter, speed);
}
if(i == heading.length){
if (j < txt.length) {
document.getElementById("welcome").innerHTML += txt.charAt(j);
j++;
setTimeout(typeWriter, speed);
}
}

}


window.onload = typeWriter()
$("#svg_perk").fadeIn(3000)