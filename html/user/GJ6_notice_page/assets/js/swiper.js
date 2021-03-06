/**
 * @filename    : swiper.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : swiper라이브러리 사용
 */

// swiper라이브러리 사용
var swiper = new Swiper('.swiper', {
    loop: true,
    cssMode: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
    },
    
});

