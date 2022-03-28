/**
 * @filename    : join.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 입력한 회원 가입 정보들 백엔드 전송 구현
 */

 document.querySelector("#join_form_group").addEventListener("submit", async (e) => {
    e.preventDefault();
    const regexHelper = new RegexHelper();

    if (!regexHelper.check_id(id, error)) { return false };
    if (!regexHelper.check_pw(password, error)) { return false };
    if (!regexHelper.check_pw_re(passowrd_re, password, error)) { return false };
    if (!regexHelper.check_name(name, error)) { return false };
    if (!regexHelper.check_tel(tel, error)) { return false };


    // 입력값 받아오기
    const user_id = document.querySelector(".user_id").value;
    const user_pw = document.querySelector(".user_pw").value;
    const user_name = document.querySelector(".user_name").value;
    const user_phone = document.querySelector(".user_phone").value;

    // 입력값에 대한 유효성 검사 진행 (생략)

    let json = null;

    try {
        const response = await axios.post("/members/join", {
            user_id: user_id,
            user_pw: user_pw,
            user_name: user_name,
            user_phone: user_phone
        });

        json = response.data;
    } catch (e) {
        swal({
            text: e.response.data.rtmsg, // Alert 내용
            buttons: {
                OK: true,  // 확인 버튼
            }
        });
        return;
    }

    swal({
        text: "회원가입이 완료되었습니다!", // Alert 내용
        buttons: {
            OK: true,  // 확인 버튼
        }
    }).then((value) => {   // 확인 버튼 이벤트
        if (value == 'OK') {
            window.location = "/GJ2_login_page/login.html"
        };
    });
});