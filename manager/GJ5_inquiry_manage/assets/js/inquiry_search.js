/**
 * @filename    : inquiry_search.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : 총 리뷰 내역 수, 삭제 버튼 구현을 위한 함수와 pagination 구현을 위한 함수 호출
 */

// 답변상태 관련 함수 정의

// 현제 답변상태와 반대되게 변경
const state_change = (state) => {
    const change = state == 'Y' ? 'N' : 'Y';
    return change;
}
// 답변상태에 따른 출력 내용을 변경
const state_translation = (state) => {
    if (state == 'Y') {
        return '답변 완료'
    } else if (state == 'N') {
        return '답변 대기'
    }
}
// 답변상태에 따른 버튼 클래스 변경
const state_btn = (state) => {
    if (state == 'Y') {
        return 'btn-success'
    } else if (state == 'N') {
        return 'btn-secondary'
    }
}

/** GET 파라미터 받기 */
const params = new URLSearchParams(window.location.search);
const query = params.get('query') || "";
const page = params.get('page') || 1;
const search = params.get('search') || 'title';
const search_state = params.get('search_state') || "";
const search_type = params.get('search_type') || "";
const order = params.get('order') || "";


// 검색어 파라미터를 input 태그에 설정된
document.querySelector('#query').value = query;
document.querySelector('#search').value = search;

(async () => {
    // ajax 결과가 저장될 json
    let json = null;
    // 총 회원수
    let total_count = null;

    // ajax 요청
    try {
        const response = await axios.get('/inquiry', {
            params: {
                query: query,
                page: page,
                search: search,
                search_state: search_state,
                search_type: search_type,
                order: order
            }
        });
        const total = await axios.get('/inquiry')
        json = response.data
        total_count = total.data.pagenation.totalCount
        console.log(json);
    } catch (e) {
        // 에러가 발생한 경우 백엔드가 주는 json 받기
        const data = e.response.data;
        alert("[" + data.rt + "] " + data.rtmsg);
    }


    // ajax결과가 존재한다면?
    if (json != null) {
        console.log(json.pagenation);
        let index = 1;
        json.item.forEach((v) => {
            const listBody = document.querySelector('#listBody')
            listBody.innerHTML +=`
            <tr>
                <th scope="row">${index}</th>
                <td><button class="btn ${state_btn(v.state)}  btn-state" data-inquiry_id=${v.inquiry_id} data-state=${state_change(v.state)}>${state_translation(v.state)}</button></td>
                <td>${v.type}</td>
                <td>${v.user_id}</td>
                <td>${v.user_name}</td>
                <td>${v.title}</td>
                <td>${v.inquiry_date}</td>
                <td>
                    <a href="/GJ5_inquiry_manage/inquiry_manage.html?inquiry_id=${v.inquiry_id}" class="btn btn-success btn-xs btn-edit">수정</a>
                    <a href="#" class="btn btn-danger btn-xs btn-delete" data-inquiry_id=${v.inquiry_id}" data-user_name="${v.user_name}">삭제</a>
                </td>
            </tr>` 
            index += 1;
        });

        document.querySelector("#count").innerHTML = total_count + "개";

        // 삭제 버튼에 대한 이벤트 처리
        const btnDelete = document.querySelectorAll(".btn-delete");
        
        btnDelete.forEach((v, i) => {
            v.addEventListener("click", async e => {
                e.preventDefault();

                // 클릭된 버튼 자신
                const current = e.currentTarget;

                // 클릭된 버튼에 숨겨진 data속성값들을 가져온다.
                const member_id = current.dataset.inquery_id;
                const user_name = current.dataset.user_name;


                if (confirm('정말' + user_name + '(을)를 삭제하시겠습니까?')) {
                    // Ajax를 통한 삭제 처리
                    try {
                        const url = '/inquiry/' + member_id;
                        await axios.delete(url);
                    } catch (e) {
                        // 에러가 발생한 경우 벡엔드가 주는 json 받기
                        const data = e.response.data;
                        alert("[" + data.rt + "]" + data.rmsg);
                        return;
                    }
                    // Ajax를 통한 삭제 요청에 성공했다면, 삭제된 항목을 HTML에서 제거해야 한다.
                    current.closest('tr').remove();
                }
            });
        });

        // 답변상태 버튼에 대한 이벤트 처리
        const btnState = document.querySelectorAll(".btn-state");
        
        btnState.forEach((v, i) => {
            v.addEventListener("click", async e => {
                e.preventDefault();

                // 클릭된 버튼 자신
                const current = e.currentTarget;

                // 클릭된 버튼에 숨겨진 data속성값들을 가져온다.
                const inquiry_id = current.dataset.inquiry_id;
                const state = current.dataset.state;
                console.log(state);

                try {                    
                    const json = await axios.put('/inquiry_state/' + inquiry_id ,{
                        state: state
                    });
                } catch (e) {
                    // 에러가 발생한 경우 벡엔드가 주는 json 받기
                    const data = e.response.data;
                    alert("[" + data.rt + "]" + data.rmsg);
                    return;
                }
                // 요청 성공시 변경된 상태에 알맞은 형태로 버튼의 속성을 변경 한다.
                current.innerHTML = state_translation(state);
                current.className = `btn ${state_btn(state)} btn-state`
                current.dataset.state = state_change(state);
            });
        });

        /** 페이지번호 구형 한수 호출하기 */
        // --> 페이지번호 HTML이 출력될 위치에 대한 selector와 페이지 번호 구현에 필요한 정보 전달
        pagenation(".pagination", json.pagenation);
        order_btn(decodeURIComponent(location.href));
        option_Y(decodeURIComponent(location.href));
        option_N(decodeURIComponent(location.href));
        type_reserve(decodeURIComponent(location.href));
        type_facility(decodeURIComponent(location.href));
        type_cancel(decodeURIComponent(location.href));
        type_besides(decodeURIComponent(location.href));
    }
})();