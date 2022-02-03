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
        btn_a.setAttribute("href",data + "&order=desc")
    }

    if(data.indexOf("?") == -1) {
        btn_a.setAttribute("href",data + "?order=desc")
    }

    if(order == 'asc' ) {
        btn_a.setAttribute("href",data.substring(0,data.indexOf('asc')) + "desc");
        icon.classList.replace("bi-sort-alpha-up-alt" ,"bi-sort-alpha-down");
    }
    if(order == 'desc'){
        btn_a.setAttribute("href",data.substring(0,data.indexOf('desc')) + "asc");
        icon.classList.replace("bi-sort-alpha-down","bi-sort-alpha-up-alt" );
    }

    btn_a.appendChild(icon);
    document.querySelector('#order_btn').appendChild(btn_a)
}

function page_reset(url) {
    const find_page = url.indexOf('page=') + 5
    console.log(url);
    console.log(url.substring(0,find_page) + 1)
    console.log(url.substring(find_page + 1))
    return (url.substring(0,find_page) + 1) + (url.substring(find_page + 1))
}

function option_Y(data) {
    const item_a = document.createElement("a");
    item_a.classList.add("dropdown-item")
    item_a.innerHTML = "답변완료"
    console.log(page_reset(data));

    // search_state가 없을때
    if(data.indexOf("search_state") == -1 ){
        if(data.indexOf("?") == -1) {
            item_a.setAttribute("href",data + "?search_state=Y")
        } else {
            item_a.setAttribute("href",data + "&search_state=Y")
        }
    }

    // search_state가 있을 때
    if(data.indexOf("search_state") != -1) {
        if(search_state == "N") {
            if (page != 1) {
                const url = page_reset(data);
                item_a.setAttribute("href",url.substring(0,url.indexOf('N')) + "Y")
            } else {
                item_a.setAttribute("href",data.substring(0,data.indexOf('N')) + "Y")
            }
        } else if(search_state == "") {
            item_a.setAttribute("href",data.substring(0,data.indexOf('search_state=')+13) + "Y")
        }
    }
    
    document.querySelector('#select_state').appendChild(item_a);
}

function option_N(data) {
    const item_a = document.createElement("a");
    item_a.classList.add("dropdown-item")
    item_a.innerHTML = "답변대기"

    // search_state가 없을때
    if(data.indexOf("search_state") == -1 ){
        if(data.indexOf("?") == -1) {
            item_a.setAttribute("href",data + "?search_state=N")
        } else {
            item_a.setAttribute("href",data + "&search_state=N")
        }
    }

    // search_state가 있을 때
    if(data.indexOf("search_state") != -1) {
        if(search_state == "Y") {
            if (page != 1) {
                const url = page_reset(data);
                item_a.setAttribute("href",url.substring(0,url.indexOf('Y')) + "N")
            } else {
                item_a.setAttribute("href",data.substring(0,data.indexOf('Y')) + "N")
            }
        } else if(search_state == "") {
            item_a.setAttribute("href",data.substring(0,data.indexOf('search_state=')+13) + "N")
        }
    }

    document.querySelector('#select_state').appendChild(item_a);
}


