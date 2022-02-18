/**
 * @filename    : my_info_out.js
 * @author      : 한송희 (onee.ssong@gmail.com) 
 * @description : 로그인된 회원 정보를 조회하여 현재 로그인 중인 정보를 삭제하여 회원 탈퇴 구현
 */

document.querySelector(".drop_button").addEventListener("click", e =>{
    swal({
        text: "정말 탈퇴하시겠습니까?", // Alert 내용
        buttons: {
            confirm: "OK",  // 확인 버튼
            cancel: true    // 취소 버튼
        }
    }).then(() => {   // 확인 버튼 이벤트
        e.preventDefault();

        (async () => {
            let json = null;

            // 세션에 저장된 로그인 정보
            try {
                const response = await axios.get('/members/info');
                json = response.data;
            } catch (e) {
                alert(e.response.data.rtmsg);
                history.back();
                return;
            }

            let member_id = json.item.member_id;

            if (json != null) {
                // 즉시실행 비동기 처리 함수
                (async () => {
                    try {
                        // Ajax 요청 보내기 -> 백엔드가 전달한 결과값이 response.data에 저장된다.
                        const response = await axios.delete("/membersout/" + member_id);
                        
                        // 백엔드에서 전달된 결과가 로그인 성공을 의미하는 경우
                        alert("탈퇴가 완료되었습니다.");
                        (async () => {
                            try {
                                // Ajax 요청 보내기 -> 백엔드가 전달한 결과값이 response.data에 저장된다.
                                const response = await axios.delete("/members/logout");
                                
                                // 백엔드에서 전달된 결과가 로그인 성공을 의미하는 경우
                                location.href = "../GJ1_main_page/main.html"
                            } catch (error) {
                                const errorMsg = "[" + error.response.status + "] " + error.response.statusText
                                console.error(errorMsg);
                                alert("로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.");
                            }
                        })();
                    } catch (error) {
                        const errorMsg = "[" + error.response.status + "] " + error.response.statusText
                        console.error(errorMsg);
                        alert("회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.");
                    }
                })();
            };
        })();
    });
});