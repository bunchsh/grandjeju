


// teb
const tebs = document.querySelectorAll(".teb_three");

for(let teb of tebs) {
    teb.addEventListener("click", e =>{
        for(let item of tebs){
            item.firstElementChild.style.borderBottom = '4px solid #999';
        }
        teb.firstElementChild.style.borderBottom = '4px solid black';
    })
}