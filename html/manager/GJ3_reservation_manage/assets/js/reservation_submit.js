/**
 * @filename    : reservation_submit.js
 * @author      : 한송희 (onee.ssong@gmail.com) 
 * @description : submit 이벤트에 대한 함수
 */

/** 수정 완료 후, submit 이벤트가 발생한 경우 */
document.querySelector("#reservation_form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // 입력값 받아오기
    const user_id = document.querySelector("#user_id").value;
    const reserv_name = document.querySelector("#reserv_name").value;
    const reserv_phone = document.querySelector("#reserv_phone").value;
    const room = document.querySelector("#room").value;
    const person = document.querySelector("#person").value;
    const stay_start = document.querySelector("#stay_start").value;
    const stay_end = document.querySelector("#stay_end").value;

    // 입력값에 대한 유효성 검사 진행 (생략)

    let json = null;

    try {
        const response = await axios.put("/reservation/" + reserv_id, {
            user_id: user_id,
            reserv_name: reserv_name,
            reserv_phone: reserv_phone,
            room: room,
            person: person,
            stay_start: stay_start,
            stay_end: stay_end
        });

        json = response.data;
    } catch (e) {
        alert(e.response.data.rtmsg);
        return;
    }

    if(json != null) {
        console.log(json);
        window.location = "/GJ3_reservation_manage/reservation_manage.html"
    }
});