/**
 * @filename    : list.js
 * @author      : 한송희 (onee.ssong@gmail.com) 
 * @description : 로그인된 회원 정보를 조회하여 각 항목의 내역들을 리스트로 출력
 */

// 답변상태에 따른 출력 내용을 변경
const state_translation = (state) => {
    if (state == 'Y') {
        return '답변 완료'
    } else if (state == 'N') {
        return '답변 대기'
    }
}

(async () => {
    let json = null;

    try {
        const response = await axios.get('/membersinfo');
        json = response.data;
    } catch (e) {
        alert(e.response.data.rtmsg);
        window.location = "/GJ2_login_page/login.html";
        return;
    }

    console.log(json.item);

    if (json != null) {
        const profile = document.querySelector("#profile-template").innerHTML;
        const p_template = Handlebars.compile(profile);
        const p_html = p_template(json.item);

        document.querySelector('#profile').insertAdjacentHTML('beforeend', p_html);

        // 예약 내역 리스트 출력
        (async () => {

            if (!json.item.user_id) {
                alert('예약 내역이 없습니다.');
                return;
            }

            let json2 = null;

            try {
                const response = await axios.get('/reservationdetail/' + json.item.user_id);
                json2 = response.data;
            } catch (e) {
                alert(e.response.data.rtmsg);
                return;
            }

            if (json2 != null) {
                console.log(json2);
                const reserv = document.querySelector("#reserv-template").innerHTML;
                const r_template = Handlebars.compile(reserv);
                const r_html = r_template(json2);
                document.querySelector('#reserv').insertAdjacentHTML('beforeend', r_html);
            }
        })();

        // 1:1 문의 내역 리스트 출력
        (async () => {

            if (!json.item.user_id) {
                alert('문의 내역이 없습니다.');
                return;
            }

            let json3 = null;

            try {
                const response = await axios.get('/inquirydetail/' + json.item.user_id);
                json3 = response.data;
            } catch (e) {
                alert(e.response.data.rtmsg);
                return;
            }

            if (json3 != null) {
                console.log(json3);
                // const inquiry = document.querySelector("#inquiry-template").innerHTML;
                json3.item.forEach((v) => {
                    const inquiry = document.querySelector("#inquiry")
                    inquiry.innerHTML += `
                    <div class="history">
                        <a href="../GJ9_inquiry_detail_page/inquiry_detail.html?inquiry_id=${v.inquiry_id}">
                            <img src="assets/img/right-arrow.png">
                            <h3 class="title_inquiry">${v.title}</h3>
                            <span class="state_inquiry">${state_translation(v.state)}</span>
                            <span class="inquiry_date">${v.inquiry_date}</span>
                        </a>
                    </div>
                `
                })
                // const i_template = Handlebars.compile(inquiry);
                // const i_html = i_template(json3);
                // document.querySelector('#inquiry').insertAdjacentHTML('beforeend', i_html);
            }
        })();

        // 리뷰 내역 리스트 출력
        (async () => {

            if (!json.item.user_id) {
                alert('리뷰 내역이 없습니다.');
                return;
            }

            let json4 = null;

            try {
                const response = await axios.get('/reviewdetail/' + json.item.user_id);
                json4 = response.data;
            } catch (e) {
                alert(e.response.data.rtmsg);
                return;
            }

            if (json4 != null) {
                console.log(json4);
                const review = document.querySelector("#review-template").innerHTML;
                const i_template = Handlebars.compile(review);
                const i_html = i_template(json4);
                document.querySelector('#review').insertAdjacentHTML('beforeend', i_html);
            }
        })();
    };
})();