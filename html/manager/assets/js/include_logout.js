// @filename    : include_logout.js
// @author      : 한송희 (onee.ssong@gmail.com)
// @description : 로그아웃 기능 구현

// 로그아웃
window.addEventListener("load", () => {
    // 페이지 로드시 로그인 여부 검사
    (async () => {
        try {
            const response = await axios.get("/admininfo");
        } catch (error) {
            alert(error.response.data.rtmsg);
            location.href = "../GJ1_login_page/login.html";
        }

        // 로그아웃
        document.getElementById("logout").addEventListener('click', e => {
            e.preventDefault();

            // 즉시실행 비동기 처리 함수
            (async () => {
                try {
                    // Ajax 요청 보내기 -> 백엔드가 전달한 결과값이 response.data에 저장된다.
                    const response = await axios.delete("/members/logout");
                    alert("로그아웃되었습니다.");
                    location.href = "../GJ1_login_page/login.html";
                } catch (error) {
                    const errorMsg = "[" + error.response.status + "] " + error.response.statusText
                    console.error(errorMsg);
                    alert("로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.");
                }
            })();
        });
    })();
});