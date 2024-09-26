const queryString = window.location.search;


const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id"); 
console.log("ID:", id);// Load categories from localStorage or start with an empty array


let categories = JSON.parse(localStorage.getItem("categories")) || [];



let selectedCategory= categories.find((cat)=>{
    if(cat.id==id){
        return true;
    }else{
        return false;
    }
})



const groupName = document.getElementById('cat-name');
groupName.innerText=(selectedCategory.name);
const taskCount = document.getElementById('task-count');
taskCount.innerHTML=id;
