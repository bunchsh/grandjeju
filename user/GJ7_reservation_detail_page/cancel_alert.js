/**
 * @filename    : cancel_alert.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 예약 취소 버튼을 눌렀을 때의 이벤트, Alert 창이 뜨는 함수
 */

 document.write("<script src='https://unpkg.com/sweetalert/dist/sweetalert.min.js'></script>");

 document.getElementsByClassName("btn_cancel")[0].addEventListener('click', function () {
    swal({
        text: "예약을 취소하시겠습니까?", // Alert 내용
        buttons: {
            confirm: "OK",  // 확인 버튼
            cancel: true    // 취소 버튼
        }
    }).then(function () {   // 확인 버튼 이벤트
        location.href = "#";    // 이동
    });
});