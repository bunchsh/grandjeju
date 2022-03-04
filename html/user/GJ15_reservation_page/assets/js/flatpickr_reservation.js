/** 
 *  @filename    : flatpickr_reservation.html
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : Grandjeju 예약하기 페이지의 숙박 기간 지정을 위한 함수 */

/** 이미 예약된 숙박 일정 조회 */
const room = document.querySelector('#room_select');
room.addEventListener("change", (e) => {
    let room_select = room.value;
    (async () => {
        const params = new URLSearchParams(window.location.search);
        const stay_start = params.get('stay_start');
        const stay_end = params.get('stay_end');

        const now = dayjs();
        const min = now.add(1, "day").format("YYYY-MM-DD");

        // ajax 결과가 저장될 json
        let json = null;
        let date = []

        // ajax 요청
        try {
            const response = await axios.get('/reservationoverlap/' + room_select);
            json = response.data;
        } catch (e) {
            // 에러가 발생한 경우 백엔드가 주는 json 받기
            alert(e.response.data.rtmsg);
        }

        // ajax 결과가 존재한다면?
        if (json.item != 0) {
            for (let i = 0; i < json.item.length; i++) {
                date.push({
                    from: json.item[i].stay_start, 
                    to: json.item[i].stay_end
                })
            };
            /** 숙박 기간 날짜 범위 선택 */
            flatpickr(".day_select", {
                mode: "range",
                minDate: min,
                dateFormat: "Y-m-d",
                disable: date,
                locale: {
                    rangeSeparator: ' ~ '
                }
            });
        } else if (json.item == 0) {
            /** 숙박 기간 날짜 범위 선택 */
            flatpickr(".day_select", {
                mode: "range",
                minDate: min,
                dateFormat: "Y-m-d",
                locale: {
                    rangeSeparator: ' ~ '
                }
            });
        };
    })();
});