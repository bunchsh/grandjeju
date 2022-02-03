/**
 * @filename    : inquiry_order.js
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

function option_Y(data) {
    const item_a = document.createElement("a");
    item_a.classList.add("dropdown-item")
    item_a.innerHTML = "답변완료"

    if(data.indexOf("search_state") == -1){
        item_a.setAttribute("href", data + "&search_state=Y")
    }

    if(data.indexOf("?") == -1) {
        item_a.setAttribute("href",data + "?search_state=Y")
    }
    if(search_state == "N") {
        item_a.setAttribute("href",data.substring(0,data.indexOf('N')) + "Y")
    }

    document.querySelector('#select_state').appendChild(item_a);
}

function option_N(data) {
    const item_a = document.createElement("a");
    item_a.classList.add("dropdown-item")
    item_a.innerHTML = "답변대기"

    if(data.indexOf("search_state") == -1){
        item_a.setAttribute("href", data + "&search_state=N")
    }

    if(data.indexOf("?") == -1) {
        item_a.setAttribute("href",data + "?search_state=N")
    }
    if(search_state == "Y") {
        console.log(data.substring(0,data.indexOf('Y')));
        item_a.setAttribute("href",data.substring(0,data.indexOf('Y')) + "N")
    }


    document.querySelector('#select_state').appendChild(item_a);
}