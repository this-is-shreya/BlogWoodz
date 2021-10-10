const search =()=>{
    let search_div = document.getElementById("search")
    let search_item =""+ $("input[name='search_text']").val()
    let search_select =""+ $("select[name='search_select']").val()
  //  alert(search_item+" and "+search_select)
    $.ajax({
      url:"/search-on-homepage",
      method:"POST",
      data:{data:search_item,filter:search_select},
      success:function(response){
       if(response!=null){
         if((search_select.includes("blog"))){
         response.forEach(res=>{
          //  alert(res.title)
           let anchor = document.getElementsByClassName('search_results')
           let flag =0
           for(let i=0;i<anchor.length;i++){
             if(anchor[i].innerText == res.title){
               flag=1
             }
           }if(flag!=1){
            $("#search").append(
              $(document.createElement('a')).prop({
                target:'',
                href:'/blog/'+res.customid,
                innerText: res.title,
                class:"search_results"
              })
            ).append(
              $(document.createElement('br'))
            )
           }
         })
       }
       else if((search_select.includes("genre"))){
        response.forEach(res=>{
         //  alert(res.title)
          let anchor = document.getElementsByClassName('search_results')
          let flag =0
          for(let i=0;i<anchor.length;i++){
            if(anchor[i].innerText == res.genre){
              flag=1
            }
          }if(flag!=1){
           $("#search").append(
             $(document.createElement('a')).prop({
               target:'',
               href:'/genre/'+res.genre,
               innerText: res.genre,
               class:"search_results"
             })
           ).append(
             $(document.createElement('br'))
           )
          }
        })
      }
       else{
         response.forEach(res=>{
           let anchor = document.getElementsByTagName('a')
           let flag =0
           for(let i=0;i<anchor.length;i++){
             if(anchor[i].innerText == res.username){
               flag=1
             }
           }
           if(flag!=1){
           $("#search").append(
             $(document.createElement('a')).prop({
               target:'',
               href:'/profile/'+res.username,
               innerText: res.username,
               class:"search_results"
             })
           ).append(
             $(document.createElement('br'))
           )
           }
            
        })
       }
       }
       if( search_item.length ==0){
         search_div.innerHTML =''
       }
      }
    })
  }