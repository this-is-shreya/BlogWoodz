let id = $("input[name='id']").val()

let user_mentions=[]
let user_id=[]
$.ajax({
  url:"/sending-user-for-mention",
  method:"GET",
  
  success:function(res){
    res.forEach(user=>{
      
      user_id.push(user.username)
      user_mentions.push(user.username)
    })
   
    $('#editor').summernote({
  height: 800,
  toolbar: [
    ['misc', ['undo', 'redo']],
    ['style', ['bold', 'italic', 'underline', 'clear']],
    ['font', ['strikethrough', 'superscript', 'subscript']],
    ['insert', ['link', 'video', 'table', 'picture']],

    ['para', ['style','ul', 'ol', 'paragraph']],

  ],
  hint: {
mentions: user_mentions,
match: /\B@(\w*)$/,
search: function (keyword, callback) {
  callback($.grep(this.mentions, function (item) {
    return item.indexOf(keyword) == 0;
  }));
},
content: function (item) {
  let index = user_mentions.indexOf(item)
  let anchor = document.createElement("a")
  anchor.innerHTML = '@'+item
  anchor.href="/profile/"+user_id[index]
  return anchor;
}    
},
maximumImageFileSize: 200*1024, 
    callbacks:{
        onImageUploadError: function(msg){
           console.log(msg + ' (200 KB)');
        }
}
});
$('.note-editable').css('font-size','15px');
  }
})



$("#ads").on("click", () => {
  $("#ads-textarea").toggle()
})

$("#post").on("click", () => {
  let blog = $("#editor").val()
  let title = $("#title").val()
  let desc = $("#desc").val()
  let thumbnail = $("#thumbnail").val()
  let ads = $("#ads-script").val()
  let genre = $("#genre").val()
  let c=0
  
  
  if(title==""){
    $("#dtitle").html("The above field cannot be empty")
    c++
  }
  if(desc==""){
    $("#ddesc").html("The above field cannot be empty")
    c++
  }
  if(c==0){
    
    $.ajax({
      url:"/post-draft",
      method:"POST",
      data: { blog: blog, title: title,desc:desc,thumbnail:thumbnail,ads:ads,id:id,
    genre:genre },
      
      success:function(res){
        window.location.href="/profile"
      }
    })
 
  }
  
})

$("#delete_confirm").on("click",()=>{

    $.ajax({
        url:"/delete-blog",
        method:"POST",
        data:{id:id},
        success:function(res){
            window.location.href="/profile"
        }
    })
})