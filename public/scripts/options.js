const myList = document.querySelectorAll("ul#search-list>li.disp-song");
const myForm = document.querySelector("#search-form");

const clickedInput = document.querySelector('input[name="track"]');

myList.forEach( listItem =>{

listItem.addEventListener('click', function (event) {
    // Get the data-value attribute from the clicked list item
    //const dataValue = event.target.getAttribute('data-value');
    const dataValue = listItem.getAttribute('data-value');
    console.log(dataValue);

    // Update the value of the hidden input
    clickedInput.value = dataValue;

    // Submit the form
    
    myForm.submit();
  
})
});
