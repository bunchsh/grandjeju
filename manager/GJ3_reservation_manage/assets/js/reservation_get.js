/**
 * @filename    : reservation_get.js
 * @author      : 한송희 (onee.ssong@gmail.com) 
 * @description : get 파라미터로 받을 예약 번호 가져오기
 */

/** 전역변수로 사용할 예약 번호 (GET파라미터로 받아야 함) */
let reserv_id = null; // 아래에서 받은 reserv_id을 받아 사용 가능

(async () => {
    /** 입력을 위한 input 태그 객체 */
    const inputUserid = document.querySelector("#user_id");
    const inputName = document.querySelector("#reserv_name");
    const inputReservphone = document.querySelector("#reserv_phone");
    const inputRoom = document.querySelector("#room");
    const inputPerson = document.querySelector("#person");
    const inputStaystart = document.querySelector("#stay_start");
    const inputStayend = document.querySelector("#stay_end");

    /** GET 파라미터 받기 */
    const params = new URLSearchParams(window.location.search);
    reserv_id = params.get('reserv_id');

    // 파라미터가 정상적이지 않으므로 메시지 출력, 전페이지 이동 처리 후 수행 중단 (return)
    if (!reserv_id) {
        alert('예약 번호가 없습니다.');
        history.back();
        return;
    }

    /** 수정 form에 기존의 데이터를 표시하기 위해 Ajax로 저장된 데이터를 조회해야 함 */
    let json = null;

    try {
        const response = await axios.get('/reservation/' + reserv_id);
        json = response.data;
    } catch (e) {
        alert(e.response.data.rtmsg);
        return;
    }

    // 조회 결과가 있다면 input 태그에 조회 데이터 세팅
    if (json != null) {
        console.log(json);
        console.log(json.item[0].room);
        roomPerson(json.item[0].room);

        inputUserid.value = json.item[0].user_id;
        inputName.value = json.item[0].reserv_name;
        inputReservphone.value = json.item[0].reserv_phone;
        inputRoom.value = json.item[0].room;
        inputPerson.value = json.item[0].person
        inputStaystart.value = json.item[0].stay_start;
        inputStayend.value = json.item[0].stay_end;

    }

})();