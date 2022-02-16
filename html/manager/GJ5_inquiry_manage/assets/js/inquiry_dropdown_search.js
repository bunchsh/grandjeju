/**
 * @filename    : inquiry_order.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : where절에 검색 조건을 추가 할 드롭다운 버튼함수 구현
 */

/**
 * URL에 page값을 1로 변경하는 함수
 * @param {string} data      현재 url값
 */
function page_reset(data) {
    const find_page = data.indexOf('page=') + 5
    return (data.substring(0,find_page) + 1) + (data.substring(find_page + 1))
}

/**
 * URL 문자열에 찾고싶은 단어의 끝위치를 리턴하는 함수
 * @param {string} data      현재 url값
 * @param {string} string   url에서 찾고싶은 단어
 */
function find_index(data,string) {
    return data.indexOf(string) + string.length
}


/**
 * 문의 종류의 드롭다운 아이템 항목을 생성하는 함수
 * @param {string} data     현재 url값
 * @param {string} type     해당 아이템이 가르키는 type정보
 */
function create_item(data,type) {
    const url = page_reset(data)
    const index = find_index(data, "search_type=")
    const u_index = find_index(url, "search_type=")

    const item_a = document.createElement("a");
    item_a.classList.add("dropdown-item")
    item_a.innerHTML = type

    // search_state가 없을때
    if(data.indexOf("search_type") == -1 ){
        if(data.indexOf("?") == -1) {
            item_a.setAttribute("href",data + "?search_type=" + type)
        } else {
            item_a.setAttribute("href",data + "&search_type=" + type)
        }
    }

    // search_state가 있을 때
    if(data.indexOf("search_type") != -1) {
        let rest_url1 = url.substring(index)
        let rest_url2 = data.substring(index)
        if (search_type != "") {
            rest_url1 = url.substring(index+search_type.length)
            rest_url2 = data.substring(index+search_type.length)
        }

        if (page != 1) {
            item_a.setAttribute("href",url.substring(0,u_index) + type + rest_url1)
        } else {
            item_a.setAttribute("href",data.substring(0,index) + type + rest_url2)
        }
    }
    document.querySelector('#select_type').appendChild(item_a);
}


function type_reserve(data) {
    create_item(data, "예약 문의")
}

function type_facility(data) {
    create_item(data, "시설 문의")
}

function type_cancel(data) {
    create_item(data, "취소 및 환불")
}

function type_besides(data) {
    create_item(data, "기타 문의")
}


/**
 * 답변상태의 종류를 변경하기위한 드롭다운 아이템 생성함수
 * @param {string} data     현재 url값
 * @param {string} string   유저에게 보여질 드롭다운 아이템 내용
 * @param {string} state    해당 아이템이 가르키는 state값 
 */
function create_item_state(data, string, state) {
    const url = page_reset(data)
    const index = find_index(data, "search_state=")
    const u_index = find_index(url, "search_state=")
    
    const item_a = document.createElement("a");

    item_a.classList.add("dropdown-item")
    item_a.innerHTML = string
    console.log(page_reset(data));

    // search_state가 없을때
    if(data.indexOf("search_state") == -1 ){
        if(data.indexOf("?") == -1) {
            item_a.setAttribute("href",data + "?search_state=" + state)
        } else {
            item_a.setAttribute("href",data + "&search_state=" + state)
        }
    }

    // search_state가 있을 때
    if(data.indexOf("search_state") != -1) {
        let rest_url1 = url.substring(index)
        let rest_url2 = data.substring(index)

        if (search_state != "") {
            rest_url1 = url.substring(index+1)
            rest_url2 = data.substring(index+1)
        }

        if (page != 1) {
            item_a.setAttribute("href",url.substring(0,u_index) + state + rest_url1)
        } else {
            item_a.setAttribute("href",data.substring(0,index) + state + rest_url2)
        }
    }
    
    document.querySelector('#select_state').appendChild(item_a);
}

function option_Y(data) {
    create_item_state(data,"답변 완료","Y")
}
function option_N(data) {
    create_item_state(data,"답변 대기","N")
}
