


// tab
const tabs = document.querySelectorAll(".tab_three");
const  tab_contents = document.querySelectorAll(".tab_content");

for(let tab of tabs) {
    tab.addEventListener("click", e =>{
        for(let item of tabs){
            item.firstElementChild.style.borderBottom = '4px solid #999';
        }
        tab.firstElementChild.style.borderBottom = '4px solid black';

        for(let con of tab_contents){
            con.classList.add('none')
        }
        const tab_content = e.currentTarget.dataset.tab;

        document.getElementById(tab_content).classList.remove('none')
    })

    
}

