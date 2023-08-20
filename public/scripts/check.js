let checks = document.querySelectorAll("input[type=checkbox");
for (let i = 0; i < checks.length; i++) {
   console.log("poop");
   checks[i].addEventListener("change",function(e){

     if (this.checked){
     console.log("checked");
     const query ="label[for=check"+i+"]";
     document.querySelector(query).classList.add("checked");
     }

     else{
         const query = "label[for=check" + i + "]";
         document.querySelector(query).classList.remove("checked");
     }


   });
}