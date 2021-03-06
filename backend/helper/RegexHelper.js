/**
 * @filename : regx_helper.js
 * @author   : 양수원 (ysw7939@gamil.com)
 * @desciption : 정규표현식 검사 수행 후, true/false로 해당 정규표현식 충족하는지 여부를 반환하는 함수들의 모음
 */
const BadRequestException = require("../exceptions/BadRequestExeption");
class RegexHelper {
    /**
     * 값의 존재 여부를 검사한다.
     * @Param {string} content 검사할 값
     * @Param {string} msg     값이 없는 경우 표시할 메시지 내용
     */

     value(content, msg) {
        if (
            content == undefined || 
            content == null || 
            content.length == 0
            ) {
            throw new BadRequestException(msg);
        }
        return true; // 성공했음을 반환
    }

    /**
     * 입력값이 지정된 글자수를 초과했는지 검사한다.
     * @Param {string} content    검사할 값
     * @param {int} len           최대 글자수
     * @param {string} msg        값이 없을 경우 표시될 메시지
     */
    maxLength(content, len, msg) {
        if (!this.value(content) || content.length > len) {
            throw new BadRequestException(msg);
        }

        return true;
    }

    /**
     * 입력값이 지정된 글자수 미만인지 검사한다.
     * @param {string} content  검사할 값
     * @param {int} len         최소 글자수
     * @param {string} msg      값이 없을 경우 표시될 메시지
     */
    minLength(content, len, msg) {
        if (!this.value(content) || content.length < len) {
            throw new BadRequestException(msg);
        }
        return true;
    }

    // /**
    //  * 두 값이 동일한지 검사한다.
    //  * @param {string} origin   원본
    //  * @param {string} compare  검사 대상
    //  * @param {string} msg      값이 없을 경우 표시될 메시지
    //  */
    // minLength(origin, compare, msg) {
    //     var src = origin.trim(); // 원본값을 가져온다.
    //     var dsc = compare.trim(); // 비교할 값을 가져온다.

    //     if (src != dsc) {
    //         throw new BadRequestException(msg);
    //     }
    //     return true;
    // }

    /**
     * 입력값이 정규표현식을 충족하는지 검사한다.
     * @param {string} content      입력내용
     * @param {string} msg          표시할 메시지
     * @param {object} regexExper   검사할 정규표현식
     */
    field(content, msg, regexExper) {
        var src = content.trim();

        // 입력값이 없거나 입력값에 대한 정규표현식 검사가 실패라면?
        if (!src || !regexExper.test(src)) {
            throw new BadRequestException(msg);
        }
        return true;
    }

    /**
     * 숫자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    num(content, msg) {
        return this.field(content, msg, /^[0-9]*$/);
    }

    /**
     * 영문으로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    eng(content, msg) {
        return this.field(content, msg, /^[a-zA-Z]*$/);
    }

    /**
     * 한글로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    kor(content, msg) {
        return this.field(content, msg, /^[ㄱ-ㅎ가-힣]*$/);
    }

    /**
     * 영문과 숫자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    engNum(content, msg) {
        return this.field(content, msg, /^[a-zA-Z0-9]*$/);
    }

    /**
     * 한글과 숫자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    korNum(content, msg) {
        return this.field(content, msg, /^[ㄱ-ㅎ가-힣0-9]*$/);
    }

    /**
     * 영문과 숫자, 특수문자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
     engNumSpecial(content, msg) {
        return this.field(content, msg, /^[a-zA-Z0-9~!@#$%^&*()_+|<>?:{}]*$/);
    }

    /**
     * 이메일주소 형식인지 검사하기 위해 field()를 간접적으로 호출한다.
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    email(content, msg) {
        return this.field(
            content,
            msg,
            /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
        );
    }

    /**
     * 핸드폰 번호 형식인지 검사하기 위해 field()를 간접적으로 호출한다.
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    cellphone(content, msg) {
        return this.field(
            content,
            msg,
            /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/
        );
    }
    /**
     * 집전화 번호 형식인지 검사하기 위해 field()를 간접적으로 호출한다.
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    telphone(content, msg) {
        return this.field(content, msg, /^\d{2,3}\d{3,4}\d{4}$/);
    }
    /**
     * 핸드폰 번호 형식과 집전화 번호 형식중 하나를 충족하는지 검사
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    cellphone(content, msg) {
        var check1 = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/; // 핸드폰 형식
        var check2 = /^\d{2,3}\d{3,4}\d{4}$/; //집전화 형식

        var src = content.trim();

        // 입력값이 없거나, 핸드푠 형식도 아니고 집전화 형식도 아니라면
        if (!src || (!check1.test(src) && !check2.test(src))) {
            throw new BadRequestException(msg);
        }
        return true;
    }
    /**
     * 문의 종류중 하나인지 검사
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    inquiry_type(content, msg) {
        if (!(content == '예약 문의'|| content == '시설 문의'|| content == '취소 및 환불'|| content == '기타 문의')) {
            throw new BadRequestException(msg);
        }
    }
    /**
     * N 혹은 Y 인지 검사
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    is_state(content, msg){
        if(!(content == 'N' || content == 'Y')) {
            throw new BadRequestException(msg);
        }
    }

    /**
     * 에디터 유효성 검사
     * @param {string} content     입력내용
     * @param {string} msg         표시할 메시지
     */
    editor_value(selector, msg) {
        // 앞뒤의 공백을 제외하고 내용만 추출
        const content = selector.replaceAll(" ","").replaceAll("<br>","").replaceAll("<p></p>","");

        if (!content) {
            throw new BadRequestException(msg);
        }
    }
}
module.exports = new RegexHelper();
