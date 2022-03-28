/**
 * @filename    : login_regex_helper.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 정규표현식 검사 수행 후, true/false로 해당 정규표현식을 충족하는지 여부를 반환하는 함수들의 모음
 */

class RegexHelper {
    // constructor() {}

    /**
     * 값의 존재 여부를 검사
     * @param {string} selector 입력 요소에 해당하는 CSS 선택자
     * @param {string} msg      값이 없을 경우 표시할 메시지 내용
     * @return {boolean}        입력된 경우 true / 입력되지 않은 경우 false
     */
    id_value(selector) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const field = document.querySelector(selector);
        const content = field.value.trim();
        const span_id = document.querySelector(".id_err");
        const span_pw = document.querySelector(".pw_err");
        const span_idpw = document.querySelector(".idpw_err");
        const input = document.querySelector(".user_id");

        if (!content) {
            // 값이 없다면?
            span_id.style.display='block';
            span_pw.style.display='none';
            span_idpw.style.display='none';
            input.style.border='2px solid red';
            field.focus(); // 대상 요소에게 포커스 강제 지정
            return false; // 실패했음을 반환
        }
        span_id.style.display='none';
        input.style.border='2px solid #ddd';
        return true; // 성공했음을 반환
    }

    pw_value(selector) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const field = document.querySelector(selector);
        const content = field.value.trim();
        const span_id = document.querySelector(".id_err");
        const span_pw = document.querySelector(".pw_err");
        const span_idpw = document.querySelector(".idpw_err");
        const input = document.querySelector(".user_pw");

        if (!content) {
            // 값이 없다면?
            span_id.style.display='none';
            span_pw.style.display='block';
            span_idpw.style.display='none';
            input.style.border='2px solid red';
            field.focus(); // 대상 요소에게 포커스 강제 지정
            return false; // 실패했음을 반환
        }
        span_pw.style.display='none';
        input.style.border='2px solid #ddd';
        return true; // 성공했음을 반환
    }

    /**
     * 입력값이 정규표현식을 충족하는지 검사
     * @param {string} selector   입력 요소에 해당하는 CSS 선택자
     * @param {string} msg        표시할 메시지
     * @param {object} regex_expr 검사할 정규 표현식
     * @return {boolean}          표현식을 충족할 경우 true / 그렇지 않을 경우 false
     */
    field(selector, msg, regex_expr) {
        const field = document.querySelector(selector);
        let src = field.value.trim(); // 입력값을 가져온다

        // 입력값이 없거나 입력값에 대한 정규표현식 검사가 실패라면?
        if (!src || !regex_expr.test(src)) {
            alert(msg); // 메시지 표시
            field.value = ''; // 입력값을 강제로 지운다
            field.focus(); // 포커스 강제 지정
            return false; // 실패했음을 반환
        }

        return true; // 성공했음을 반환
    }

    /**
     * 영문과 숫자로만 이루어졌는지 검사하기 위해 field()를 간접적으로 호출
     * @param {string} selector   입력 요소에 해당하는 CSS 선택자
     * @param {string} msg        표시할 메시지
     * @return {boolean}          표현식을 충족할 경우 true / 그렇지 않을 경우 false
     */
     eng_nump(selector, msg) {
        return this.field(selector, msg, /^[a-zA-Z0-9]*$/);
    }

    /**
     * 영문과 숫자, 특수문자 (_), (-)로만 이루어졌는지 검사하기 위해 field()를 간접적으로 호출
     * @param {string} selector   입력 요소에 해당하는 CSS 선택자
     * @param {string} msg        표시할 메시지
     * @return {boolean}          표현식을 충족할 경우 true / 그렇지 않을 경우 false
     */
     eng_nump(selector, msg) {
        return this.field(selector, msg, /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])$/);
    }
}

document.querySelector('#login').addEventListener("submit", async e => {
    e.preventDefault();

    const regexHelper = new RegexHelper();

    /** 아이디 검사 */
    if (!regexHelper.id_value(".user_id")) { return false; }

    /** 비밀번호 검사 */
    if (!regexHelper.pw_value(".user_pw")) { return false; }

    let json = null;

    const user_id = document.querySelector(".user_id").value;
    const user_pw = document.querySelector(".user_pw").value;
    const span = document.querySelector(".idpw_err");

    try {
        const response = await axios.post("/members/login", {
            user_id: user_id,
            user_pw: user_pw
        });

        json = response.data;
        
    } catch (e) {
        span.style.display = 'block';
        return;
    }

    // 처리 완료
    span.style.display = 'none';
    location.href = "/GJ1_main_page/main.html";
});