/**
 * @filename    : cancel_alert.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 예약 취소 버튼을 눌렀을 때의 이벤트, Alert 창이 뜨는 함수
 */

 document.querySelector('.cancel').addEventListener("submit", e => {
    e.preventDefault();

    alert("!!입력형식 검사 완료!!");
});