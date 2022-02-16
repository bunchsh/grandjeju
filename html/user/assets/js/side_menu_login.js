// @filename    : side_menu_login.js
// @author      : 한송희 (onee.ssong@gmail.com)
// @description : 로그인 여부에 따른 Sidebar 구성 및 로그아웃 기능 구현

// 페이지 로드시 로그인 여부 검사
window.addEventListener("load", () => {
    (async () => {
        try {
            const response = await axios.get("/memberstest/info");
            
            // 백엔드에서 전달된 결과가 로그인 성공을 의미하는 경우
            document.getElementById("login_button").style.display = "none";
            document.getElementById("mypage_button").style.display = "block";
            document.getElementById("logout").style.display = "block";
        } catch (error) {
            document.getElementById("login_button").style.display = "block";
            document.getElementById("mypage_button").style.display = "none";
            document.getElementById("logout").style.display = "none";
        }

        // 로그아웃
        document.getElementById("logout").addEventListener('click', e => {
            e.preventDefault();

            // 즉시실행 비동기 처리 함수
            (async () => {
                try {
                    // Ajax 요청 보내기 -> 백엔드가 전달한 결과값이 response.data에 저장된다.
                    const response = await axios.delete("/memberstest/logout");
                    
                    // 백엔드에서 전달된 결과가 로그인 성공을 의미하는 경우
                    document.getElementById("login_button").style.display = "block";
                    document.getElementById("mypage_button").style.display = "none";
                    document.getElementById("logout").style.display = "none";
                    alert('로그아웃되었습니다.');
                } catch (error) {
                    const errorMsg = "[" + error.response.status + "] " + error.response.statusText
                    console.error(errorMsg);
                    alert("로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.");
                }
            })();
        });
    })();
});
