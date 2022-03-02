/**
 * @filename    : cancel_alert_oneday.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 예약 취소 버튼을 눌렀을 때의 이벤트, Alert 창이 뜨는 함수
 */

/** 예약 취소 불가 Alert */
document.getElementsByClassName("btn_cancel_oneday")[0].addEventListener('click', function () {
    swal({
        text: "예약 취소가 불가합니다", // Alert 내용
        buttons: {
            confirm: "OK",  // 확인 버튼
        }
    });
});