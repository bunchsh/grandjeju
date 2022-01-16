/**
 * @filename    : script.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : swiper라이브러리 사용, 햄버거 사이드 메뉴바 작동코드
 */

// swiper라이브러리 사용
var swiper = new Swiper('.swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
    },
});

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
