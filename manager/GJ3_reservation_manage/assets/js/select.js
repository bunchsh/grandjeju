/**
 * @filename    : select.js
 * @author      : 한송희 (onee.ssong@gmail.com) 
 * @description : 객실, 인원 드롭다운 옵션 가져오기
 */

// 객실 드롭다운 옵션 가져오기 
(async () => {
    // ajax 결과가 저장될 json 
    let json = null;

    // ajax 요청
    try {
        const response = await axios.get('/reservation');
        json = response.data;
    } catch (e) {
        // 에러가 발생한 경우 백엔드가 주는 json 받기
        const data = e.response.data;
        alert('[' + data.rt + '] ' + data.rtmsg);
        return;
    }

    // ajax 결과가 존재한다면?
    if (json != null) {
        // dropdown 객체
        const deptnoDropdown = document.querySelector("#room");

        json.item.map((v, i) => {
            const option = document.createElement("option");
            option.setAttribute("value", v.room);
            option.innerHTML = v.room;
            deptnoDropdown.appendChild(option);
        });
    }
})();

// 인원 드롭다운 옵션 가져오기
(async () => {
    // ajax 결과가 저장될 json 
    let json = null;

    // ajax 요청
    try {
        const response = await axios.get('/reservation');
        json = response.data;
    } catch (e) {
        // 에러가 발생한 경우 백엔드가 주는 json 받기
        const data = e.response.data;
        alert('[' + data.rt + '] ' + data.rtmsg);
        return;
    }

    // ajax 결과가 존재한다면?
    if (json != null) {
        // dropdown 객체
        const deptnoDropdown = document.querySelector("#person");

        json.item.map((v, i) => {
            const option = document.createElement("option");
            option.setAttribute("value", v.person);
            option.innerHTML = v.person;
            deptnoDropdown.appendChild(option);
        });
    }
})();