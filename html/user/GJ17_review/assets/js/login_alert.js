/**
 * @filename    : login_alert.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 로그인 상태에서 리뷰 작성 페이지로 이동 / 비로그인 상태에서 글 작성 버튼을 눌렀을 때 나타나는 이벤트
 */

/** 로그인 Alert */
document.querySelector(".btn-write").addEventListener('click', e => {
    (async () => {
        let json = null;
    
        try {
            const response = await axios.get('/members/info');
            json = response.data;
        } catch (e) {
            swal({
                text: e.response.data.rtmsg, // Alert 내용
                buttons: {
                    OK: true,  // 확인 버튼
                }
            }).then((value) => {   // 확인 버튼 이벤트
                if (value == 'OK') {
                    window.location = "../GJ2_login_page/login.html";
                };
            });
            return;
        }
    
        console.log(json.item);
    
        if (json != null) {
            window.location = "/GJ18_review_write_page/review_write.html";
        } else {
            swal({
                text: "로그인 후, 이용해 주세요.", // Alert 내용
                buttons: {
                    confirm: "OK",  // 확인 버튼
                }
            })
        };
    })();
});