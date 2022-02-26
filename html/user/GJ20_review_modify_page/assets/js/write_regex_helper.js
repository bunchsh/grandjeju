/**
 * @filename    : write_regex_helper.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : REVIEW 작성 정규표현식 검사 수행 후, true/false로 해당 정규표현식을 충족하는지 여부를 반환하는 함수들의 모음
 */

 class RegexHelper {
    // constructor() {}

    /**
     * 값의 존재 여부를 검사
     * @param {string} selector 입력 요소에 해당하는 CSS 선택자
     * @param {string} msg      값이 없을 경우 표시할 메시지 내용
     * @return {boolean}        입력된 경우 true / 입력되지 않은 경우 false
     */

    value(selector, msg) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const field = document.querySelector(selector);
        const content = field.value.trim();

        if (!content) {
            // 값이 없다면?
            swal({
                text: msg, // Alert 내용
                buttons: {
                    confirm: "OK",  // 확인 버튼
                }
            });
            field.focus(); // 대상 요소에게 포커스 강제 지정
            return false; // 실패했음을 반환
        }
        return true; // 성공했음을 반환
    }

    editor_value(selector, msg) {
        // 앞뒤의 공백을 제외하고 내용만 추출

        const content = selector.replaceAll(" ","").replaceAll("<br>","").replaceAll("<p></p>","");
        console.log(selector)
        console.log(content);

        if (!content) {
            // 값이 없다면?
            swal({
                text: msg, // Alert 내용
                buttons: {
                    confirm: "OK",  // 확인 버튼
                }
            });
            return false; // 실패했음을 반환
        }
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
}