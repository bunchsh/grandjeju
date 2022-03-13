/** GET 파라미터 받기 */
const params = new URLSearchParams(window.location.search);
const query = params.get('query') || "";
const page = params.get('page') || 1;
const search = params.get('search') || 'title';
const order = params.get('order') || "";

(async () => {
    // ajax 결과가 저장될 json
    let json = null;
    // 총 회원수
    let total_count = null;

    // ajax 요청
    try {
        const response = await axios.get('/review', {
            params: {
                query: query,
                page: page,
                search: search,
                order: order
            }
        });
        const total = await axios.get('/review')
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
        json.item.forEach((v) => {
            const content_ul = document.querySelector('#content_ul')
            content_ul.innerHTML +=
            `
                <li>
                    <a href="/GJ19_review_datail_page/review_detail.html?review_id=${v.review_id}">
                        <img src="assets/img/right-arrow.png">
                        <h4 class="title">${v.title}</h4>
                        <p class="date">
                            <span class="name">${v.user_name} |</span>
                            ${v.review_date}
                        </p>
                    </a>
                </li>
            `
        });


        /** 페이지번호 구형 한수 호출하기 */
        // --> 페이지번호 HTML이 출력될 위치에 대한 selector와 페이지 번호 구현에 필요한 정보 전달
        pagenation(".pagination", json.pagenation);
    }
})();