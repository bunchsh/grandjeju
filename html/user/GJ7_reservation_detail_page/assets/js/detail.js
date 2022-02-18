/**
 * @filename    : detail.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 선택한 항목의 reserv_id를 통해 예약 내역을 조회해 출력하는 비동기 함수
 */

 (async () => {
    /** GET 파라미터 받기 */
    const params = new URLSearchParams(window.location.search);
    const reserv_id = params.get('reserv_id');

    if (!reserv_id) {
        alert('조회할 예약 내역이 없습니다.');
        history.back();
        return;
    }

    /** Ajax 요청 */
    let json = null;

    try {
        const response = await axios.get('/reservation/' + reserv_id);
        json = response.data;
    } catch (e) {
        alert(e.response.data.rtmsg);
        return;
    }

    if (json != null) {
        console.log(json);
        const source = document.querySelector("#content-template").innerHTML;
        const template = Handlebars.compile(source);
        const html = template(json.item[0]);

        document.querySelector('#content').insertAdjacentHTML('beforeend', html);
    }
})();