// GET 파라미터 받기
const params = new URLSearchParams(window.location.search);
let inquiry_id = params.get('inquiry_id');

(async () => {
    // 출력할 요소에 대한 변수 선언
    const type = document.querySelector(".type")
    const title = document.querySelector(".title_title")
    const inquiry_date = document.querySelector(".inquiry_date")
    const inquiry_text = document.querySelector(".inquiry_text")
    const answer_text = document.querySelector(".answer_text")
    const btn_group = document.querySelector(".btn_group")

    // 데이터를 저장할 전역변수 
    let json_inquiry = null;
    let json_login = null;
    try {
        const response1 = await axios.get('/inquiry/' + inquiry_id)
        const response2 = await axios.get('/membersinfo');
        json_inquiry = response1.data
        json_login = response2.data
    }catch (e) {
        alert(e.response.data.rtmsg);
        return;
    }
    console.log(json_inquiry);

    // 요소 출력
    if(json_inquiry != null) {

        // 작성자와 접속유저가 일치하는지 확인
        if (json_inquiry.item[0].user_id != json_login.item.user_id) {
            alert("접근 권한이 없습니다");
            history.back()
            throw new Error("접근 권한이 없습니다");
        }
        title.innerHTML = json_inquiry.item[0].title;
        type.innerHTML = json_inquiry.item[0].type
        inquiry_date.innerHTML = json_inquiry.item[0].inquiry_date
        inquiry_text.innerHTML = json_inquiry.item[0].inquiry_text
        
        if (json_inquiry.item[0].answer_text == null) {
            answer_text.insertAdjacentHTML('afterbegin',
                `
                <span class="no_answer">답변 대기 중입니다.</span>
                `
            )
        } else {
            answer_text.innerHTML = json_inquiry.item[0].answer_text
        }
    }


    const btn_modify = document.querySelector(".btn_modify");
    const btn_delete = document.querySelector(".btn_delete");
    const btn_modify_after = document.querySelector(".btn_delete_after");

    if(json_inquiry.item[0].state == "Y") {
        btn_modify.style.display='none';
        btn_delete.style.display='none';
        btn_modify_after.style.display='block';
    }
})();