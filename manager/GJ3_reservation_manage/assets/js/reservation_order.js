/**
 * @filename    : reservation_order.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : order by를 사용한 내림차순 버튼 구현을 위한 함수
 */

// 내림차순 버튼
function order_btn(date) {
    const btn_a = document.createElement("a")
    btn_a.setAttribute("href", date + "&order=asc")
    btn_a.classList.add("btn");
    btn_a.classList.add("btn-dark");

    const icon = document.createElement("i")
    icon.classList.add("bi");
    icon.classList.add("bi-sort-alpha-down");

    btn_a.appendChild(icon);
    document.querySelector('#order_btn').appendChild(btn_a)
}