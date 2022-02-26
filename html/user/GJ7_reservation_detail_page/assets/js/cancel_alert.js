/**
 * @filename    : cancel_alert.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 예약 취소 버튼을 눌렀을 때의 이벤트, Alert 창이 뜨는 함수
 */

// const { DailyRotateFile } = require("winston/lib/winston/transports");

 /** 예약 취소 Alert */
 document.getElementsByClassName("btn_cancel")[0].addEventListener('click', (e) => {
    swal({
        text: "예약을 취소하시겠습니까?", // Alert 내용
        buttons: {
            confirm: "OK",  // 확인 버튼
            cancel: true    // 취소 버튼
        }
    }).then(() => {   // 확인 버튼 이벤트
        // 즉시실행 비동기 처리 함수
        (async () => {
            e.preventDefault();

            const params = new URLSearchParams(window.location.search);
            const reserv_id = params.get('reserv_id');

            try {
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
            } catch (error) {
                const errorMsg = "[" + error.response.status + "] " + error.response.statusText
                console.error(errorMsg);
                alert("예약 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.");
            }
        })();
    });
});