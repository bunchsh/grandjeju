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
        console.log(json.item);

        // ajax 결과가 존재한다면?
        if (json.item != null) {
            for (let i = 0; i < json.item.length; i++) {
                console.log(json.item[i]);
                date.push({
                    from: json.item[i].stay_start, 
                    to: json.item[i].stay_end
                })
            };
            console.log(date)
            /** 숙박 기간 날짜 범위 선택 */
            flatpickr(".day_select", {
                mode: "range",
                minDate: "today",
                dateFormat: "Y-m-d",
                disable: date,
                locale: {
                    rangeSeparator: ' ~ '
                }
            });
        } else if (json.item.length == 0) {
            /** 숙박 기간 날짜 범위 선택 */
            flatpickr(".day_select", {
                mode: "range",
                minDate: "today",
                dateFormat: "Y-m-d",
                locale: {
                    rangeSeparator: ' ~ '
                }
            });
        };
    })();
});

/** 숙박 기간 날짜 범위 선택 */
// flatpickr(".day_select", {
//     mode: "range",
//     minDate: "today",
//     dateFormat: "Y-m-d",
//     disable: ["2022-01-30", "2022-02-21", "2022-03-08", new Date(2025, 4, 9) ],
//     locale: {
//         rangeSeparator: ' ~ '
//     }
// });