// const TypeWriter = function(txtElement, words, wait = 3000){
//    this.txtElement = txtElement;
//    this.words = words;
//    this.txt = '';
//    this.wordIndex = 0;
//    this.wait = parseInt(wait, 10); //making sure that it is an integer in the parameter
//    this.type();
//    this.isDeleting = false;

// }

// //Type Method
// TypeWriter.prototype.type = function(){
//    //current index of word
//    // % this is to make sure that after the last index go back to the first index
//    const current = this.wordIndex % this.words.length
//    //full txt of current word
//    const fullTxt = this.words[current];
//    // fullTxt == developer
   
//    //check if deleting
//    if(this.isDeleting){
//       //Remove character
//       this.txt = fullTxt.substring(0, this.txt.length - 1)
//    } else{
//       //Add character
//       this.txt = fullTxt.substring(0, this.txt.length + 1)
//    }
   
//    //Insert txt into element
//    this.txtElement.innerHTML = `<span class="txt"> ${this.txt}</span>`;

//    //Initial Type speed
//    let typeSpeed = 350;

//    if(this.isDeleting){
//       typeSpeed /= 2; //typespeed = typespeed / 2;
//    }

//    //  If word is complete
//    if (!this.isDeleting && this.txt === fullTxt){
//       // Make pause at end
//       typeSpeed = this.wait;
      
//       // set delete to true so that it will do the deleting in the first if statement
//       this.isDeleting = true;
//    } else if(this.isDeleting && this.txt === ''){
//       this.isDeleting = false;
//       //move to the next word
//       this.wordIndex++;
//       //Pause before start typing
//       typeSpeed= 500;
//    }

//    setTimeout(()=> this.type(), typeSpeed) //kinda word like a infinite loop of a result 
// };



// ES6 class
class TypeWriter{
   constructor(txtElement, words, wait = 300){ // 300 in wait is by default
      this.txtElement = txtElement;
      this.words = words;
      this.txt = '';
      this.wordIndex = 0;
      this.wait = parseInt(wait, 10); //making sure that it is an integer in the parameter
      this.type();
      this.isDeleting = false;
   }

   type(){
      //current index of word
   // % this is to make sure that after the last index go back to the first index
   const current = this.wordIndex % this.words.length
   //full txt of current word
   const fullTxt = this.words[current];
   // fullTxt == developer
   
   //check if deleting
   if(this.isDeleting){
      //Remove character
      this.txt = fullTxt.substring(0, this.txt.length - 1)
   } else{
      //Add character
      this.txt = fullTxt.substring(0, this.txt.length + 1)
   }
   
   //Insert txt into element
   this.txtElement.innerHTML = `<span class="txt"> ${this.txt}</span>`;

   //Initial Type speed
   let typeSpeed = 350;

   if(this.isDeleting){
      typeSpeed /= 2; //typespeed = typespeed / 2;
   }

   //  If word is complete
   if (!this.isDeleting && this.txt === fullTxt){
      // Make pause at end
      typeSpeed = this.wait;
      
      // set delete to true so that it will do the deleting in the first if statement
      this.isDeleting = true;
   } else if(this.isDeleting && this.txt === ''){
      this.isDeleting = false;
      //move to the next word
      this.wordIndex++;
      //Pause before start typing
      typeSpeed= 500;
   }

   setTimeout(()=> this.type(), typeSpeed) //kinda word like a infinite loop of a result 
   }
}

//Init on DOM load (window.onload)
document.addEventListener('DOMContentLoaded',init);

// Init App
function init(){
   const txtElement = document.querySelector('.txt-type'); 
   const words = JSON.parse(txtElement.getAttribute('data-words')); //JSON.parse will change it into JSON format
   const wait = txtElement.getAttribute("data-wait")
   //console.log(words)

   //Init TypeWriter
   new TypeWriter(txtElement,words,wait);
}