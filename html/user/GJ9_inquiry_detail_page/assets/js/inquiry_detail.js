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
        answer_text.innerHTML = json_inquiry.item[0].answer_text
        
    }


    
    if(json_inquiry.item[0].state == "N") {
        btn_group.insertAdjacentHTML('afterbegin',
            `
            <button class="btn_modify" type="button"><a href="/GJ10_inquiry_modify_page/inquiry_modify.html?inquiry_id=${inquiry_id}">수정</a></button>
            `
        )  
    }
})();