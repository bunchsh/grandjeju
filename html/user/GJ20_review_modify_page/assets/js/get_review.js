/**
 * @filename    : get_review.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : get 파라미터로 받을 예약 번호 가져오기
 */

/** 전역변수로 사용할 예약 번호 (GET파라미터로 받아야 함) */
let review_id = null; // 아래에서 받은 review_id을 받아 사용 가능

(async () => {
    /** 입력을 위한 input 태그 객체 */
    const title = document.querySelector(".title_input")

    /** GET 파라미터 받기 */
    const params = new URLSearchParams(window.location.search);
    review_id = params.get('review_id');

    // 파라미터가 정상적이지 않으므로 메시지 출력, 전페이지 이동 처리 후 수행 중단 (return)
    if (!review_id) {
        alert('리뷰 번호가 없습니다.');
        history.back();
        return;
    }

    /** 수정 form에 기존의 데이터를 표시하기 위해 Ajax로 저장된 데이터를 조회해야 함 */
    let json = null;

    try {
        const response = await axios.get('/review/' + review_id);
        json = response.data;
    } catch (e) {
        alert(e.response.data.rtmsg);
        return;
    }

    // 조회 결과가 있다면 input 태그에 조회 데이터 세팅
    if (json != null) {

        title.value = json.item[0].title;
        editor.setHTML(json.item[0].text);
    }

})();