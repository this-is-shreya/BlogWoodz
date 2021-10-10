
  let ele = document.getElementsByClassName("trending_link")
  ele[0].classList.add("active")
    
$(document).ready(function(){


const get_trend2 =()=>{
    let output=0
  //   alert("working")
    $.ajax({
      url: "/get-trending",
      method:"GET",
      success:function(data){
        for(let k=0;k<data.length;k++){
          // console.log(data[k]._id,data[k].title)
          output = find_elem2(data[k]._id,k,data[k].title)
          // console.log(output)
       if(output>0){
         break
       }
        }
     
     

      }
    })
    // demo.innerHTML += "<p>done</p>"
  }

setInterval(get_trend2,3000)

const find_elem2 =(id,pos,title)=>{
let made_changes =0
var other_height=[]
var o=[]
let cards = document.querySelectorAll(".card")

cards.forEach(card=>{
  var a =($("#"+card.id).offset().top)
  other_height.push(a)
  o.push(a)
}) 
//     for(let len=0;len<cards.length;len++){
//         var a =($("#"+cards[len].id).offset().top)
//   other_height.push(a)
//   o.push(a)
//     }
var top = $("#"+id).offset().top
let i=0

let j=0
i=top -o.sort((a,b)=>a-b)[pos]

// console.log(`top ${top} sub ${o[pos]} i ${i} title ${title}`)
if(i>0){
// console.log(`${title} is going up`)
cards.forEach(card=>{
      
  if(other_height[j]>=(top-i)&& top>other_height[j]){
    // alert(card.id)
    let str="#"+card.id
    // console.log(str)
  $(str).animate({
    
    top:"+=17em"
  },"slow")
}
j++

})

$("#"+id).animate({ 
"top":"-="+i+"px"
},"slow")
made_changes++
}
j=0
if(i<0){
i=Math.abs(o[pos] - top)
console.log(`${title} will go down i ${i}`)

cards.forEach(card=>{
  
if(other_height[j]>(top) && other_height[j]<=(top+i)){
console.log(`${card.id} hiii`)

$("#"+card.id).animate({
"top":"-=17em"
},"slow")

}j++
})
i=i+40
console.log(`i is ${i} id ${id} `)
$("#"+id).animate({ 
"top":"+="+i+"px"
},"slow")
made_changes++
}
return made_changes
  }
})