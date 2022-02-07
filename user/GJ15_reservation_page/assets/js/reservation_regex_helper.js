/**
 * @filename    : reservation_regex_helper.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 정규표현식 검사 수행 후, true/false로 해당 정규표현식을 충족하는지 여부를 반환하는 함수들의 모음
 */

class RegexHelper {

    /**
     * 입력값이 지정된 글자수 미만인지 검사
     * @param {string} selector 입력 요소에 해당하는 CSS 선택자
     * @param {int} len         최대 글자수
     * @return {boolean}        지정된 글자수 이상인 경우 true / 미만일 경우 false
     */
     min_length(selector, len) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const field = document.querySelector(selector);
        const content = field.value.trim();
        const span = document.querySelector(".errmsg_min");
        const input = document.querySelector(".booker_input");

        if (content.length < len) {
            // 입력값이 주어진 길이보다 작다면?
            span.style.display = 'block';
            input.style.border = '2px solid red';
            field.focus(); // 대상 요소에게 포커스 강제 지정
            return false; // 실패했음을 반환
        } else {
            span.style.display = 'none';
            input.style.border = '2px solid #ddd';
        }
        return true; // 성공했음을 반환
    }

    /**
     * 값의 존재 여부를 검사
     * @param {string} selector 입력 요소에 해당하는 CSS 선택자
     * @return {boolean}        입력된 경우 true / 입력되지 않은 경우 false
     */
    room_value(selector) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const field = document.querySelector(selector);
        const content = field.value.trim();
        const span = document.querySelector(".errmsg_room");
        const input = document.querySelector("#room_select");

        if (!content) {
            // 값이 없다면?
            span.style.display = 'block';
            input.style.border = '2px solid red';
            field.focus(); // 대상 요소에게 포커스 강제 지정
            return false; // 실패했음을 반환
        } else {
            span.style.display = 'none';
            input.style.border = '2px solid #ddd';
        }
        return true; // 성공했음을 반환
    }

    /**
     * 값의 존재 여부를 검사
     * @param {string} selector 입력 요소에 해당하는 CSS 선택자
     * @return {boolean}        입력된 경우 true / 입력되지 않은 경우 false
     */
    day_value(selector) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const field = document.querySelector(selector);
        const content = field.value;
        const span = document.querySelector(".errmsg_day");
        const input = document.querySelector(".far");

        if (!content) {
            // 값이 없다면?
            span.style.display = 'block';
            // input.style.border = '2px solid red';
            return false; // 실패했음을 반환
        } else {
            span.style.display = 'none';
            return true; // 성공했음을 반환
        }
    }

    /**
     * 값의 존재 여부를 검사
     * @param {string} selector 입력 요소에 해당하는 CSS 선택자
     * @return {boolean}        입력된 경우 true / 입력되지 않은 경우 false
     */
    booker_value(selector) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const field = document.querySelector(selector);
        const content = field.value.trim();
        const span = document.querySelector(".errmsg_booker");
        const input = document.querySelector(".booker_input");

        if (!content) {
            // 값이 없다면?
            span.style.display = 'block';
            input.style.border = '2px solid red';
            field.focus(); // 대상 요소에게 포커스 강제 지정
            return false; // 실패했음을 반환
        } else {
            span.style.display = 'none';
            input.style.border = '2px solid #ddd';
        }
        return true; // 성공했음을 반환
    }

    /**
     * 값의 존재 여부를 검사
     * @param {string} selector 입력 요소에 해당하는 CSS 선택자
     * @return {boolean}        입력된 경우 true / 입력되지 않은 경우 false
     */
    phone_value(selector) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const field = document.querySelector(selector);
        const content = field.value.trim();
        const span = document.querySelector(".errmsg_phone");
        const input = document.querySelector(".phone_input");

        if (!content) {
            // 값이 없다면?
            span.style.display = 'block';
            input.style.border = '2px solid red';
            field.focus(); // 대상 요소에게 포커스 강제 지정
            return false; // 실패했음을 반환
        } else {
            span.style.display = 'none';
            input.style.border = '2px solid #ddd';
        }
        return true; // 성공했음을 반환
    }

    /**
     * 한글로만 이루어졌는지 검사
     * @param {string} selector   입력 요소에 해당하는 CSS 선택자
     * @return {boolean}          표현식을 충족할 경우 true / 그렇지 않을 경우 false
     */
     kor(selector) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const field = document.querySelector(selector);
        const content = field.value.trim();
        let kor = /^[ㄱ-ㅎ가-힣]*$/;
        const span = document.querySelector(".errmsg_kor");
        const input = document.querySelector(".booker_input");

        if (!kor.test(content)) {
            // 한글이 아니라면?
            span.style.display = 'block';
            input.style.border = '2px solid red';
            field.focus(); // 대상 요소에게 포커스 강제 지정
            return false; // 실패했음을 반환
        } else {
            span.style.display = 'none';
            input.style.border = '2px solid #ddd';
        }
        return true; // 성공했음을 반환
    }

    /**
     * 휴대폰 번호 형식인지 검사
     * @param {string} selector   입력 요소에 해당하는 CSS 선택자
     * @return {boolean}          표현식을 충족할 경우 true / 그렇지 않을 경우 false
     */
    cellphone(selector, msg) {
        return this.field(selector, msg, /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/);
    }
    phone(selector) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const field = document.querySelector(selector);
        const content = field.value.trim();
        let phone = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
        const span = document.querySelector(".errmsg_phone");
        const input = document.querySelector(".phone_input");

        if (!phone.test(content)) {
            // 휴대폰 형식이 아니라면?
            span.style.display = 'block';
            input.style.border = '2px solid red';
            field.focus(); // 대상 요소에게 포커스 강제 지정
            return false; // 실패했음을 반환
        } else {
            span.style.display = 'none';
            input.style.border = '2px solid #ddd';
        }
        return true; // 성공했음을 반환
    }

    /**
     * 결제수단이 선택되어 있는지 검사
     * @param {string} selector 입력 요소에 해당하는 CSS 선택자
     * @return {boolean}        체크된 경우 true / 체크되지 않은 경우 false
     */
     check(selector) {
        const field = document.querySelectorAll(selector);
        const span = document.querySelector(".errmsg_paytype");
        let checked = false;

        Array.from(field).some((v, i) => {
            if (v.checked) {
                checked = true;
                return true;
            }
        });
        // 반복이 끝까지 수행되면 체크된 항목이 없다는 의미이므로 false 반환
        if (!checked) {
            // 선택이 안 되었다면?
            span.style.display = 'block';
            return false; // 실패했음을 반환
        } else {
            span.style.display = 'none';
        }
        return checked;
    }
}

/** 미선택 및 미입력 사항과 유효성 검사 */
document.querySelector('#reservation').addEventListener("submit", e => {
    e.preventDefault();

    const regexHelper = new RegexHelper();

    /** 객실 검사 */
    if (!regexHelper.room_value("#room_select")) { return false; }

    /** 숙박 기간 검사 */
    if (!regexHelper.day_value(".day_select")) { return false; }

    /** 예악자명 검사 */
    if (!regexHelper.booker_value(".booker_input")) { return false; }
    if (!regexHelper.min_length(".booker_input")) { return false; }
    if (!regexHelper.kor(".booker_input")) { return false; }

    /** 예악자 연락처 검사 */
    if (!regexHelper.phone_value(".phone_input")) { return false; }
    if (!regexHelper.phone(".phone_input")) { return false; }

    /** 결제 수단 검사 */
    if (!regexHelper.check("input[name=pay]")) { return false; }

    
});

