const api = "api_key=dc140afe3fd3a251c2fdf9dcd835be5c";

let searchPhotos = [];

let srequest;
let sreceived;
let recent = [];

let favRequest;
let favReceived;
let favIdList = [];
let fav = [];




$(document).ready(function(){ 
   location_select();
   favPhotos();
   

//  search for the location ID
   function search_id(location){
      let text = location;
      let searchidStr= "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=12&format=json&nojsoncallback=1&" + api + "&text=" + text;

      $.get(searchidStr, function(data){
         srequest = data.photos.photo.length;
         sreceived = 0
         searchPhotos = [];
      for(let i=0; i<data.photos.photo.length;i++){
         let search_id = data.photos.photo[i].id;
         let search_title = data.photos.photo[i].title;
         let searchObj = {id:search_id, title:search_title}
         searchPic(searchObj);
         };
         
         
      });
      
   }

   // get the locataion pictures source after getting the picture's Id
   function searchPic(searchObj){
      let getSizesStr = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&" +api + "&photo_id=" + searchObj.id;
      $.get(getSizesStr, function(data){
         sreceived++;
         let smallIndex = 0;
         let largeIndex = (data.sizes.size.length -1)

         //  for loop to get the small size index
         for(var i = 0; i < data.sizes.size.length; i++) {
            var obj = data.sizes.size[i];
               if ((obj.label) == "Small"){
                  smallIndex = i;
               }
               else{
                  continue;
               }
               
        }

        for(var i = 0; i < data.sizes.size.length; i++) {
         var obj = data.sizes.size[i];
            if ((obj.label) == "Large"){
               largeIndex = i;
            }
            else{
               continue;
            }
         }

         searchObj.small = data.sizes.size[smallIndex].source;
         searchObj.full = data.sizes.size[largeIndex].source;
         searchPhotos.push(searchObj);
         
         if (sreceived == srequest){
            
            searchDisplay(searchPhotos);
         }
      });
   }




//    display the location pictures after searching
   function searchDisplay(searchPhotos){
      let htmls = "";
      for(let i = 0; i < searchPhotos.length; i++){
         // console.log(searchPhotos[i].full)
         htmls += `<figure data-full="${searchPhotos[i].full}" >
         <img src="${searchPhotos[i].small}" alt="${searchPhotos[i].title}" width="150" height="150">
         <figcaption class= "caption"> ${searchPhotos[i].title}</figcaption>
         </figure>`;
      }
      $("#container").html(htmls);

      // modal display
      $('figure ').each(function(index){
         $(this).click(function(){
            
            let newTitle = $(this).children("img").attr("alt");// this is the figure and there is a img insde the figure so grab that and grab 'alt' in the img
            
            $('#modal-container').css('display','block');
            $('#modal-content').attr('src', $(this).attr('data-full'))
            $('#modal-caption').html(newTitle)
         });

         $('#close').click(function(){
            $('#modal-container').css('display','none');
            $('#modal-content').attr('src','');
         });

         //  recent history
         $(this).click(function(){
            let historyImage = $(this).children("img").attr("src");
            let historyTitle = $(this).children("img").attr("alt");
            let historyFullImage = $(this).attr('data-full');
            let historyObj = {image:historyImage, title:historyTitle, fullImage:historyFullImage};
            var bool = false
        
            // Recent array == 5 and no duplicate and recently view picture display on top
            if ((recent.length) < 5)  {
               for(let i = 0; i < recent.length; i++){
                  if(recent[i].image == historyObj.image){
                     recent.splice(i,1)
                  }
               }
               recent.unshift(historyObj)
            }
            else if (recent.length == 5){
               for(let i = 0; i < recent.length; i++){
                  if(recent[i].image == historyObj.image){
                     recent.splice(i,1)
                     recent.unshift(historyObj)
                     bool = true
                  }
               }
            if (bool == false){
               recent.pop()
               recent.unshift(historyObj)
            }   
               
            }
              
            // adding to the html
            let historyhtml = "";
            for(let i = 0; i < recent.length; i++){
               historyhtml += `<li id = "recent-list">
               <div id="recent-item" data-full = "${recent[i].fullImage}">
                  <img id="recent-photo" src="${recent[i].image}">
                  <div id="recent-caption">
                     <caption>
                        ${recent[i].title}
                     </caption>
                  </div>   
               </div>
            </li>`;
            }
            $("#recent-nav").html(historyhtml);

            recentModal();
               
        
         });
      })
   };


      // display modal to the recent add pictures
   function recentModal(){
      var x = document.querySelectorAll("#recent-list")
      if ($(x) !==undefined){
         $(x).on('click',function(){
            let recentTitle = $(this).children("#recent-item").text();
            let recentFullImage = $(this).children("#recent-item").attr("data-full");
            
            $('#modal-container').css('display','block');
            $('#modal-content').attr('src', recentFullImage)
            $('#modal-caption').html(recentTitle)
         
            $('#close').click(function(){
            $('#modal-container').css('display','none');
            $('#modal-content').attr('src','');
         });
      });
   }
   }



   // location selection
   function location_select(){
      $("#brisbane").click(function(){
         $("#container").css("visibility","visible")
         $("#fav-container").css("display","none")
         let place = "brisbane";
         search_id(place);
      })
      $("#sydney").click(function(){
         $("#container").css("visibility","visible")
         $("#fav-container").css("display","none")
         let place = "sydney";
         search_id(place);
      })
      $("#melbourne").click(function(){
         $("#container").css("visibility","visible")
         $("#fav-container").css("display","none")
         let place = "melbourne";
         search_id(place);
      })
      $("#goldcoast").click(function(){
         $("#container").css("visibility","visible")
         $("#fav-container").css("display","none")
         let place = "gold coast";
         search_id(place);
      })
      $("#blueMountain").click(function(){
         $("#container").css("visibility","visible")
         $("#fav-container").css("display","none")
         let place = "blue mountain";
         search_id(place);
      })
   }

   // favourte photos
   function favPhotos(){
      let intUrl = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&per_page=5&format=json&nojsoncallback=1&" + api 
      
      $.get(intUrl, function(data){
         favRequest = data.photos.photo.length;
         favReceived = 0;
         fav = [];
         
      for(let i=0; i<data.photos.photo.length;i++){
         let fav_id = data.photos.photo[i].id;
         favIdList.push(fav_id)
         }; 
         favIdLast = favIdList[favIdList.length -1]
         
         photoUser(favIdList, favReceived)
      })
   }

   function photoUser(favIdList){
      for (let i = 0; i < favIdList.length; i++){
         let fav_id = favIdList[i]
         let userUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&format=json&nojsoncallback=1&" + api +"&photo_id="+ fav_id
         
      
         $.get(userUrl, function(data){
            let name = data.photo.owner.realname
            let username = data.photo.owner.username
            // for change empty names to username
            if (name == "") {
               name = username
            }

            let favObj = {id:fav_id, name:name}
            
            getFavourite(favObj)
            
         });
      }
      }

   function getFavourite(favObj){
      let fav_id = favObj.id
      
      let favUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getFavorites&format=json&nojsoncallback=1&" + api +"&photo_id=" + fav_id

      $.get(favUrl , function(data){
         let total = data.photo.total
         favObj.total = total
         getFavPic(favObj)
      })
    
      
      
   }

   // getting the interesting image source for favourite
   function getFavPic(favObj){
     
      let fav_id = favObj.id
     
      let getSizesStr = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&" +api + "&photo_id=" + fav_id;

      $.get(getSizesStr, function(data){
         favReceived++;
         let sizeLength = data.sizes.size.length - 1
         let imageSource = data.sizes.size[sizeLength].source
         favObj.image = imageSource
         fav.push(favObj)
         if (favReceived == favRequest){
            favDisplay(fav)
         }
      });

        
         
   }
   
   function favDisplay(fav){

      let htmls = "";
      for(let i = 0; i < fav.length; i++){
         // console.log(searchPhotos[i].full)
         htmls += `<div id="card">
         <div id= "card-img">
         <img src="${fav[i].image}" alt="${fav[i].id}" width="450" height="450">
         </div>
         <div id = "caption">
         <figcaption">By: ${fav[i].name}</figcaption>
         <figcaption> <i class="fas fa-heart"></i>
         ${fav[i].total} <figcaption>
         </div>
         </div>`;
      }
      $("#fav-container").html(htmls);

   }


   // scroll transparent function
   $(window).scroll(function(){

      if ($(window).scrollTop()>50){
         $("#main-nav").css("opacity", "0.85")
      }
      else{
         $("#main-nav").css("opacity", "1")
      }

    
   })      


});


   