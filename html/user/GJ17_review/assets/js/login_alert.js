/**
 * @filename    : login_alert.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 비로그인 상태에서 글 작성 버튼을 눌렀을 때 나타나는 이벤트
 */

 /** 로그인 Alert */
 document.getElementsByClassName("btn-write-logout")[0].addEventListener('click', function () {
    swal({
        text: "로그인 후, 이용해 주세요.", // Alert 내용
        buttons: {
            confirm: "OK",  // 확인 버튼
        }
    })
});