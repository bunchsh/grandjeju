/**
 * @filename    : inquiry_submit.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : submit 이벤트에 대한 함수
 */

/** 수정 완료 후, submit 이벤트가 발생한 경우 */
document.querySelector("#inquiry_answer_form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // 입력값 받아오기
    const type = document.querySelector("#type").value;
    const title = document.querySelector("#title").value;
    const inquiry_text = inquiry_editor.getHTML()
    const answer_text = answer_editor.getHTML()


    // 입력값에 대한 유효성 검사 진행 (생략)

    let json = null;

    try {
        const response = await axios.put("/inquiry/" + inquiry_id, {
            type: type,
            title: title,
            inquiry_text: inquiry_text,
            answer_text: answer_text,
        });

        json = response.data;
    } catch (e) {
        alert(e.response.data.rtmsg);
        return;
    }

    if(json != null) {
        window.location = "/GJ5_inquiry_manage/inquiry_manage.html"
    }
    
});