/** 
 *  @filename    : flatpickr_reservation.html
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : Grandjeju 예약하기 페이지의 결제 금액 출력을 위한 함수 */

/** 객실에 따른 가격 */
const room = document.querySelector('#room_select');
room.addEventListener('change', e => {
    console.log("객실:: ", room.options[room.selectedIndex].dataset.price);

    let room_price = parseInt(room.options[room.selectedIndex].dataset.price);

    if (isNaN(room_price)) {
        room_price = '';
    } else {
        document.querySelector('.payfee').innerHTML = room_price;
    }
});

/** 인원에 따른 추가금 책정 */
const person = document.querySelector('#person_select');
person.addEventListener('change', e => {
    console.log("인원 추가금:: ", person.options[person.selectedIndex].dataset.price);
    
    let room_price = parseInt(room.options[room.selectedIndex].dataset.price);
    let person_price = parseInt(person.options[person.selectedIndex].dataset.price);
    
    let total_price = room_price + person_price;

    if (isNaN(total_price)) {
        total_price = '';
    } else {
        document.querySelector('.payfee').innerHTML = total_price;
    }
});

/** 숙박 기간 COUNT */
const date = document.querySelector('.day_select');
date.addEventListener('change', e => {
    let date_range = date.value;
    let start = date_range.slice(0, 10)
    let cut = date_range.indexOf('~') + 2
    let end = date_range.slice(cut, cut + 10)

    let start_date = new Date(start);
    let end_date = new Date(end);

    const diff_date = start_date.getTime() - end_date.getTime();
    let date_days = Math.abs(diff_date / (1000 * 3600 * 24));

    console.log("기간:: ", date_days);

    /** 객실 변경 시, 결제 금액 */
    room.addEventListener('change', e => {
        console.log(room.options[room.selectedIndex].dataset.price);
    
        let total_price = (parseInt(person.options[person.selectedIndex].dataset.price) + parseInt(room.options[room.selectedIndex].dataset.price)) * date_days;
    
        if (isNaN(total_price)) {
            total_price = '';
        } else {
            document.querySelector('.payfee').innerHTML = total_price;
        }
    });

    /** 최종 결제할 가격 */
    let total_price = (parseInt(person.options[person.selectedIndex].dataset.price) + parseInt(room.options[room.selectedIndex].dataset.price)) * date_days;

    if (isNaN(total_price)) {
        total_price = '';
    } else {
        document.querySelector('.payfee').innerHTML = total_price;
    }
});