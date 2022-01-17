/**
 * @filename    : script.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : 햄버거 사이드 메뉴바 작동코드
 */

// 햄버거 버튼
const burger = document.querySelector(".hamburger_icon");
const side = document.querySelector("#side_menu_bar");
const x = document.querySelector(".x_button");

burger.addEventListener("click" ,e =>{
    side.classList.add("side_menu_bar_active")
    side.style.transition = "transform 0.5s";
})

x.addEventListener("click" ,e =>{
    side.classList.remove("side_menu_bar_active");
})


// 드롭다운
const articles = document.querySelectorAll(".clear");
const menu = document.querySelectorAll(".dropdown_menu")

for(const article of articles){
    article.addEventListener("click" ,e =>{
        
        const sibling = article.nextElementSibling;
        const img = article.lastElementChild;
        
        if (sibling.hasAttribute("id","dropdown_menu_active")){
            sibling.removeAttribute("id","dropdown_menu_active");
            img.src = "./assets/img/down-arrow.png"
        } else {
            sibling.setAttribute("id","dropdown_menu_active");
            img.src = "./assets/img/up-arrow.png"
            sibling.style.transition = "transform 0.5s, height 0.5s";
        }
    })
}