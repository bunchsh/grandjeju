/**
 * @filename    : members_submit.js
 * @author      : 한송희 (onee.ssong@gmail.com) 
 * @description : submit 이벤트에 대한 함수
 */

/** 수정 완료 후, submit 이벤트가 발생한 경우 */
document.querySelector("#members_form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // 입력값 받아오기
    const user_id = document.querySelector("#user_id").value;
    const user_name = document.querySelector("#user_name").value;
    const user_phone = document.querySelector("#user_phone").value;

    // 입력값에 대한 유효성 검사 진행 (생략)

    let json = null;

    try {
        const response = await axios.put("/members/" + member_id, {
            user_id: user_id,
            user_name: user_name,
            user_phone: user_phone
        });

        json = response.data;
    } catch (e) {
        alert(e.response.data.rtmsg);
        return;
    }
});