/**
 * @filename    : reservation_search.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : 전체 예약 내역, 삭제 버튼 구현을 위한 함수와 pagination 구현을 위한 함수 호출
 */

// 핸들바 인덱스 번호
Handlebars.registerHelper('inc', function(index) {
    index++;
    return index;
})

/** GET 파라미터 받기 */
const params = new URLSearchParams(window.location.search);
const query = params.get('query') || "";
const page = params.get('page') || 1;
const search = params.get('search') || 'user_id';
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
        const response = await axios.get('/reservation', {
            params: {
                query: query,
                page: page,
                search: search,
                order: order
            }
        });
        const total = await axios.get('/reservation')
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
        const source = document.querySelector("#reservation-list-template").innerHTML;
        const template = Handlebars.compile(source);
        const html = template(json);

        document.querySelector("#listBody").insertAdjacentHTML('beforeend', html);
        document.querySelector("#count").innerHTML = total_count + "명";

        // 삭제 버튼에 대한 이벤트 처리
        const btnDelete = document.querySelectorAll(".btn-delete");

        btnDelete.forEach((v, i) => {
            v.addEventListener("click", async e => {
                e.preventDefault();

                // 클릭된 버튼 자신
                const current = e.currentTarget;

                // 클릭된 버튼에 숨겨진 data속성값들을 가져온다.
                const reserv_id = current.dataset.reserv_id;
                const reserv_name = current.dataset.reserv_name;

                if (confirm('정말 ' + reserv_name + '님의 예약을 취소하시겠습니까?')) {

                    try {
                        const response = await axios.post("/payments/cancel", {
                            reserv_id: reserv_id
                        });

                    } catch (error) {
                        const errorMsg = "[" + error.response.status + "] " + error.response.statusText
                        console.error(errorMsg);
                        alert("예약 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.");
                    }

                    // Ajax를 통한 삭제 처리
                    try {
                        const url = '/reservation/' + reserv_id;
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

        /** 페이지번호 구현 함수 호출하기 */
        // --> 페이지번호 HTML이 출력될 위치에 대한 selector와 페이지 번호 구현에 필요한 정보 전달
        pagenation(".pagination", json.pagenation);
        order_btn(decodeURIComponent(location.href));
    }
})();