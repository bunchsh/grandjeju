/**
 * @filename    : review_order.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : order by를 사용한 내림차순 버튼 구현을 위한 함수
 */

// 내림차순 버튼
function order_btn(data) {
    const btn_a = document.createElement("a")
    btn_a.setAttribute("id","order_a")
    btn_a.classList.add("btn");
    btn_a.classList.add("btn-dark");
    
    const icon = document.createElement("i")
    icon.classList.add("bi");
    icon.classList.add("bi-sort-alpha-down");

    if(data.indexOf("order") == -1) {
        btn_a.setAttribute("href",data + "&order=asc")
    }

    if(data.indexOf("?") == -1) {
        btn_a.setAttribute("href",data + "?order=asc")
    }

    if(order == 'asc' ) {
        btn_a.setAttribute("href",data.substring(0,data.indexOf('asc')) + "desc");
        icon.classList.replace("bi-sort-alpha-down","bi-sort-alpha-up-alt" );
    }
    if(order == 'desc'){
        btn_a.setAttribute("href",data.substring(0,data.indexOf('desc')) + "asc");
        icon.classList.replace("bi-sort-alpha-up-alt" ,"bi-sort-alpha-down");
    }

    btn_a.appendChild(icon);
    document.querySelector('#order_btn').appendChild(btn_a)
}