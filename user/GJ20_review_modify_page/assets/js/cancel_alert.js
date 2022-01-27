/**
 * @filename    : cancel_alert.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 1:1 문의 상세 페이지에서 삭제 버튼을 눌렀을 때의 이벤트, Alert 창이 뜨는 함수
 */

 /** 삭제 Alert */
 document.getElementsByClassName("btn_delete")[0].addEventListener('click', function () {
    swal({
        text: "정말 삭제하시겠습니까?", // Alert 내용
        buttons: {
            confirm: "OK",  // 확인 버튼
            cancel: true    // 취소 버튼
        }
    }).then(function () {   // 확인 버튼 이벤트
        location.href = "#";    // 이동
    });
});