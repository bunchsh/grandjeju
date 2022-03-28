/**
 * @filename    : detail.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 선택한 항목의 reserv_id를 통해 예약 내역을 조회해 출력하는 비동기 함수
 */

(async () => {
    let json = null;

    // 세션에 저장된 로그인 정보
    try {
        const response = await axios.get('/membersinfo');
        json = response.data;
    } catch (e) {
        alert(e.response.data.rtmsg);
        history.back();
        return;
    }

    (async () => {
        /** GET 파라미터 받기 */
        const params = new URLSearchParams(window.location.search);
        const reserv_id = params.get('reserv_id');
    
        if (!reserv_id) {
            alert('조회할 예약 내역이 없습니다.');
            history.back();
            return;
        }
    
        /** Ajax 요청 */
        let json2 = null;
    
        try {
            const response = await axios.get('/reservation/' + reserv_id);
            json2 = response.data;
        } catch (e) {
            alert(e.response.data.rtmsg);
            return;
        }
    
        if (json2.item.length == 0) {
            alert('조회할 예약 내역이 없습니다.');
            history.back();
            return;
        }
    
        if (json2 != null) {
            console.log(json2);
            console.log(json2.item[0].order_no);
            const source = document.querySelector("#content-template").innerHTML;
            const template = Handlebars.compile(source);
            const html = template(json2.item[0]);
            
            // 현재 날짜
            const now = dayjs();
            
            // 입실일
            const start_date = dayjs(json2.item[0].stay_start);
            console.log(start_date);

            // 입실일 전 날짜
            const yesterday = start_date.subtract(1, "day").format("YYYY-MM-DD");
            console.log(yesterday);
    
            document.querySelector('#content').insertAdjacentHTML('beforeend', html);

            if (now.isAfter(start_date) == true) {
                document.querySelector(".btn_group").style.display="none";
                document.querySelector(".complete").style.display="block";
            };

            /** 예약 취소 Alert */
            document.getElementsByClassName("btn_cancel")[0].addEventListener('click', (e) => {
                if (now.format("YYYY-MM-DD") == json2.item[0].stay_start || now.format("YYYY-MM-DD") == yesterday) {
                    swal({
                        text: "예약 취소가 불가합니다. \n 취소 시 유의 사항을 확인해 주세요.",
                        button: {
                            OK: true
                        }
                    });
                } else {
                    swal({
                        text: "예약을 취소하시겠습니까?", // Alert 내용
                        buttons: {
                            OK: true,  // 확인 버튼
                            cancel: "cancel"    // 취소 버튼
                        }
                    }).then(async (value) => {   // 확인 버튼 이벤트
                        if (value == 'OK') {
                            // 즉시실행 비동기 처리 함수
                        const params = new URLSearchParams(window.location.search);
                        const reserv_id = params.get('reserv_id');
                        console.log(reserv_id);
    
                        try {
                            const response = await axios.post("/payments/cancel", {
                                reserv_id: reserv_id
                            });
    
                        } catch (error) {
                            const errorMsg = "[" + error.response.status + "] " + error.response.statusText
                            console.error(errorMsg);
                            alert("예약 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.");
                        }
                        // Ajax 요청 보내기 -> 백엔드가 전달한 결과값이 response.data에 저장된다.
                        const response = await axios.delete("/reservation/" + reserv_id);
                        // 백엔드에서 전달된 결과가 로그인 성공을 의미하는 경우
                        swal({
                            text: "예약 취소가 완료되었습니다.", // Alert 내용
                            buttons: {
                                confirm: "OK",  // 확인 버튼
                            }
                        }).then(() => {
                            window.location = "/GJ4_my_page/my.html"
                        });
                        }
                    });
                }
            });
        }
    })();
})();