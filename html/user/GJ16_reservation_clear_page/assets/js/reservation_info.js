/**
 *  @filename    : reservation_info.html
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 예약한 내역 확인을 위한 예약 완료 페이지 출력 함수
 */

(async () => {
    let json = null;

    try {
        const response = await axios.get('/membersinfo');
        json = response.data;
    } catch (e) {
        swal({
            text: e.response.data.rtmsg, // Alert 내용
            buttons: {
                OK: true,  // 확인 버튼
            }
        }).then((value) => {   // 확인 버튼 이벤트
            if (value == 'OK') {
            window.location = "/GJ2_login_page/login.html";
            return;
            }
        });
    }

    if (json != null) {
        (async () => {
            /** GET 파라미터 받기 */
            const params = new URLSearchParams(window.location.search);
            const reserv_id = params.get('reserv_id');

            if (!reserv_id) {
                swal({
                    text: '해당 예약 내역이 없습니다.', // Alert 내용
                    buttons: {
                        OK: true,  // 확인 버튼
                        cancel: "cancel"    // 취소 버튼
                    }
                }).then((value) => {   // 확인 버튼 이벤트
                    if (value == 'OK') {
                        history.back();
                        return;
                    }
                });
            }

            /** Ajax 요청 */
            let json2 = null;

            try {
                const response = await axios.get('/reservation/' + reserv_id);
                json2 = response.data;
            } catch (e) {
                swal({
                    text: e.response.data.rtmsg, // Alert 내용
                    buttons: {
                        OK: true,  // 확인 버튼
                    }
                }).then((value) => {   // 확인 버튼 이벤트
                    if (value == 'OK') {
                    return;
                    }
                });
            }

            if (json2 != null) {
                console.log(json2);
                const source = document.querySelector("#contents-template").innerHTML;
                const template = Handlebars.compile(source);
                const html = template(json2.item[0]);

                document.querySelector('#contents').insertAdjacentHTML('beforeend', html);

                // 해당 예약 상세 내역 페이지 이동
                document.querySelector('.btn_ok').addEventListener('click', e => {
                    location.href="/GJ7_reservation_detail_page/reservation_detail.html?reserv_id=" + json2.item[0].reserv_id;
                });
            }
        })();
    };
})();