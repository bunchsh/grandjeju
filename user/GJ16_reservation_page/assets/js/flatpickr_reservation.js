/** 
 *  @filename    : flatpickr_reservation.html
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : Grandjeju 예약하기 페이지의 숙박 기간 지정을 위한 함수 */

/** 숙박 기간 날짜 범위 선택 */
flatpickr(".day_select", {
    mode: "range",
    minDate: "today",
    dateFormat: "Y-m-d",
    locale: {
        rangeSeparator: ' ~ '
    }
});