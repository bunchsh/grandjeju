/**
 * @filename    : join_regex_helper.js
 * @author      : 양수원 (ysw7939@gmail.com)
 * @description : 정규표현식 검사 수행 후, true/false로 해당 정규표현식을 충족하는지    여부를 반환하는 함수들의 모음
 */

class RegexHelper{

    /**
     * 아이디 입력에 대한 유효성 검사
     * @param {object} input  id input 태그를 가르키는 객체
     * @param {object} msg    유효성 검사를 통과못할 경우 메시지를 출력할 태그를 가르키는 배열 형태의 객체
     * @return {boolean}       유효성검사가 통과될 경우 true / 그렇지 않은 경우 false
     */
    check_id(i,e) {
        const id_trim = i.value.trim()
        var id_pattern = /^[a-zA-Z0-9]{6,20}$/;
        if(!id_trim) {
            e[0].innerHTML = "아이디를 입력해주세요";
            e[0].style.display = "block";
            i.style.border= '2px solid red';
            return false;
        } else if(!id_pattern.test(id_trim)) {
            e[0].innerHTML = "아이디는 영문,숫자 조합 6~20자까지 가능합니다.";
            e[0].style.display = "block";
            i.style.border= '2px solid red';
            return false;
        } else {
            i.style.border= '1px solid #000';
            e[0].style.display = "none";
            return true;
        }
    }
    /**
     * 비밀번호 입력에 대한 유효성 검사
     * @param {object} input  pw input 태그를 가르키는 객체
     * @param {object} msg    유효성 검사를 통과못할 경우 메시지를 출력할 태그를 가르키는 배열 형태의 객체
     * @return {boolean}       유효성검사가 통과될 경우 true / 그렇지 않은 경우 false
     */
    check_pw(i,e){
        const pw_trim = i.value.trim()
        var pw_pattern = /^[a-zA-Z0-9~!@#$%^&*()_+|<>?:{}]{8,11}$/;
        if(!pw_trim) {
            e[1].innerHTML = "비밀번호를 입력해주세요";
            e[1].style.display = "block";
            i.style.border= '2px solid red';
            return false;
        } else if(!pw_pattern.test(pw_trim)){
            e[1].innerHTML = "비밀번호는 영문,숫자,특수문자 조합 8~11자까지 입력 가능합니다.";
            e[1].style.display = "block";
            i.style.border= '2px solid red';
            return false;
        } else {
            i.style.border= '1px solid #000';
            e[1].style.display = "none";
            return true;
        }
    }
    /**
     * 비밀번호 확인에 대한 유효성 검사
     * @param {object} input  검사 대상 pw_re input 태그를 가르키는 객체
     * @param {object} input  원본의 pw input 태그를 가르키는 객체
     * @param {object} msg    유효성 검사를 통과못할 경우 메시지를 출력할 태그를 가르키는 배열 형태의 객체
     * @return {boolean}       유효성검사가 통과될 경우 true / 그렇지 않은 경우 false
     */
    check_pw_re(i,p,e){
        const pw_re = i.value.trim();
        const pw = p.value.trim();
        if(!pw_re){
            e[2].innerHTML = "비밀번호를 한번 더 입력 해주세요";
            e[2].style.display = "block";
            i.style.border= '2px solid red';
            return false;
        } else if(pw!==pw_re) {
            e[2].innerHTML = "비밀번호가 일치하지 않습니다.";
            e[2].style.display = "block";
            i.style.border= '2px solid red';
            return false;
        } else {
            i.style.border= '1px solid #000';
            e[2].style.display = "none";
            return true;
        }
    }
    /**
     * 이름 입력에 대한 유효성 검사
     * @param {object} input  이름 input 태그를 가르키는 객체
     * @param {object} msg    유효성 검사를 통과못할 경우 메시지를 출력할 태그를 가르키는 배열 형태의 객체
     * @return {boolean}       유효성검사가 통과될 경우 true / 그렇지 않은 경우 false
     */
    check_name(i,e){
        const name_trim = i.value.trim();
        var name_pattern =  /^[ㄱ-ㅎ가-힣]{2,10}$/;
        if(!name_trim) {
            e[3].innerHTML = "이름을 입력해주세요";
            e[3].style.display = "block";
            i.style.border= '2px solid red';
            return false;
        } else if(!name_pattern.test(name_trim)){
            e[3].innerHTML = "이름은 2자 이상 한글만 입력 가능합니다.";
            e[3].style.display = "block";
            i.style.border= '2px solid red';
            return false;
        } else {
            i.style.border= '1px solid #000';
            e[3].style.display = "none";
            return true;
        }
    }
    /**
     * 휴대폰 번호 입력에 대한 유효성 검사
     * @param {object} input  휴대폰 번호 input 태그를 가르키는 객체
     * @param {object} msg    유효성 검사를 통과못할 경우 메시지를 출력할 태그를 가르키는 배열 형태의 객체
     * @return {boolean}       유효성검사가 통과될 경우 true / 그렇지 않은 경우 false
     */
    check_tel(i,e){
        const tel_trim = i.value.trim();
        var tel_pattern =  /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
        if(!tel_trim) {
            e[4].innerHTML = "휴대폰 번호를 입력해주세요";
            e[4].style.display = "block";
            i.style.border= '2px solid red';
            return false;
        } else if(!tel_pattern.test(tel_trim)){
            e[4].innerHTML = "형식에 맞지 않는 번호입니다.";
            e[4].style.display = "block";
            i.style.border= '2px solid red';
            return false;
        } else {
            i.style.border= '1px solid #000';
            e[4].style.display = "none";
            return true;
        }
    }


}



const regex = new RegexHelper();

// 각 인풋 태그에 대한 변수선언
const error = document.querySelectorAll(".error_text");
const id = document.querySelector('.join_id');
const password = document.querySelector(".join_pw");
const passowrd_re = document.querySelector(".join_pw_re");
const name = document.querySelector(".join_name");
const tel = document.querySelector(".join_tel");


// input 요소에서 커서가 벗어났을때 아이디 유효성 검사
id.addEventListener("focusout", e =>{
    regex.check_id(id,error);
});
// input 요소에서 커서가 벗어났을때 비밀번호 유효성 검사
password.addEventListener("focusout", e=>{
    regex.check_pw(password,error);
});
// input 요소에서 커서가 벗어났을때 비밀번호 확인 유효성 검사
passowrd_re.addEventListener("focusout", e=>{
    regex.check_pw_re(passowrd_re,password,error);
})
// input 요소에서 커서가 벗어났을때 이름 유효성 검사
name.addEventListener("focusout", e=>{
    regex.check_name(name,error);
})
// input 요소에서 커서가 벗어났을때 휴대폰 번호 유효성 검사
tel.addEventListener("focusout", e=>{
    regex.check_tel(tel,error);
})

// 데이터를 전송 할때 (submit버튼) 폼요소 전체의 유효성 검사
document.querySelector("#join_form_group").addEventListener("submit" ,e =>{
    e.preventDefault();
    console.log(error,id);
    const regexHelper = new RegexHelper();

    if(!regexHelper.check_id(id,error)){return false};
    if(!regexHelper.check_pw(password,error)){return false};
    if(!regexHelper.check_pw_re(passowrd_re,password,error)){return false};
    if(!regexHelper.check_name(name,error)){return false};
    if(!regexHelper.check_tel(tel,error)){return false};

    alert("회원가입 완료");
})