/**
 *  @filename    : pay_price.html
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : Grandjeju 예약하기 페이지의 결제 금액 출력과 아임포트를 통한 결제 및 예약 정보 DB 전송을 위한 함수 */

 (async () => {
    let json = null;
    let total_price = null; // 최종 결제 금액을 저장할 변수

    let start = null;   // 입실일 변수
    let cut = null;     // 문자열 파싱을 위한 변수
    let end = null;     // 퇴실일 변수
    
    try {
        const response = await axios.get('/members/info');
        json = response.data;
    } catch (e) {
        alert(e.response.data.rtmsg);
        window.location = "/GJ2_login_page/login.html";
        return;
    }
    
    /** 객실에 따른 가격 */
    const room = document.querySelector("#room_select");
    room.addEventListener("change", (e) => {
        console.log("객실:: ", room.options[room.selectedIndex].dataset.price);
        let room_price = parseInt(room.options[room.selectedIndex].dataset.price);
        if (isNaN(room_price)) {
            room_price = "";
        } else {
            document.querySelector(".payfee").innerHTML = room_price;
        }
    });
    
    /** 인원에 따른 추가금 책정 */
    const person = document.querySelector("#person_select");
    person.addEventListener("change", (e) => {
        console.log(
            "인원 추가금:: ",
            person.options[person.selectedIndex].dataset.price
        );
        let room_price = parseInt(room.options[room.selectedIndex].dataset.price);
        let person_price = parseInt(
            person.options[person.selectedIndex].dataset.price
        );
        let total_price = room_price + person_price;
        if (isNaN(total_price)) {
            total_price = "";
        } else {
            document.querySelector(".payfee").innerHTML = total_price;
        }
    });
    
    // regexHelper 클래스 호출
    const regexHelper = new RegexHelper();
    
    // 예약자명과 예약자 연락처를 검사하는 로직
    function regex() {
        if (!regexHelper.booker_value(".booker_input")) {
            return false;
        }
        if (!regexHelper.min_length(".booker_input")) {
            return false;
        }
        if (!regexHelper.kor(".booker_input")) {
            return false;
        }
        /** 예악자 연락처 검사 */
        if (!regexHelper.phone_value(".phone_input")) {
            return false;
        }
        if (!regexHelper.phone(".phone_input")) {
            return false;
        }
        return true;
    }
    
    /** 숙박 기간 COUNT */
    const date = document.querySelector(".day_select");
    date.addEventListener("change", (e) => {
        let date_range = date.value;
        let start = date_range.slice(0, 10);
        let cut = date_range.indexOf("~") + 2;
        let end = date_range.slice(cut, cut + 10);
        let start_date = new Date(start);
        let end_date = new Date(end);
        const diff_date = start_date.getTime() - end_date.getTime();
        let date_days = Math.abs(diff_date / (1000 * 3600 * 24));
        console.log("기간:: ", date_days);
    
        /** 객실 변경 시, 결제 금액 */
        room.addEventListener("change", (e) => {
            console.log(room.options[room.selectedIndex].dataset.price);
            let total_price =
                (parseInt(person.options[person.selectedIndex].dataset.price) +
                    parseInt(room.options[room.selectedIndex].dataset.price)) *
                date_days;
            if (isNaN(total_price)) {
                total_price = "";
            } else {
                document.querySelector(".payfee").innerHTML = total_price;
            }
        });
    
        /** 최종 결제할 가격 */
        total_price =
            (parseInt(person.options[person.selectedIndex].dataset.price) +
                parseInt(room.options[room.selectedIndex].dataset.price)) *
            date_days;
        if (isNaN(total_price)) {
            total_price = "";
        } else {
            document.querySelector(".payfee").innerHTML = total_price;
        }
    
        const pay_radio = document.getElementsByName("pay");
        const buyer_name = document.getElementsByClassName("booker_input").value;
        const buyer_tel = document.getElementsByClassName("phone_input").value;
        for (let i = 0; i < pay_radio.length; i++) {
            pay_radio[i].addEventListener("click", (e) => {
                console.log(pay_radio[i].value);
                if (pay_radio[i].value == "creditcard") {
                    document
                        .querySelector("#reservation")
                        .addEventListener("submit", (e) => {
                            e.preventDefault();
                            console.log("신용카드");
                            if (regex()) {
                                IMP.init("imp52209533");
                                // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
                                // i'mport 관리자 페이지 -> 내정보 -> 가맹점식별코드
                                IMP.request_pay({
                                    pg: "html5_inicis",
                                    pay_method: "card",
                                    merchant_uid: "grandjeju" + new Date().getTime(),
                                    name: "GrandJeju",
                                    amount: total_price,
                                    buyer_name: buyer_name,
                                    buyer_tel: buyer_tel,
                                    m_redirect_url: "https://www.yourdomain.com/payments/complete",
                                    /*
                                    모바일 결제시,
                                    결제가 끝나고 랜딩되는 URL을 지정
                                    (카카오페이, 페이코, 다날의 경우는 필요없음. PC와 마찬가지로 callback함수로 결과가 떨어짐)
                                    */
                                },
                                    async (rsp) => {
                                        console.log(rsp);
                                        if (rsp.success) {
                                            var msg = "결제가 완료되었습니다.";
                                            msg += "고유ID : " + rsp.imp_uid;
                                            msg += "상점 거래ID : " + rsp.merchant_uid; //결제번호
                                            msg += "결제 금액 : " + rsp.paid_amount;
                                            msg += "카드 승인번호 : " + rsp.apply_num;

                                            // 입력값 받아오기
                                        const room = document.querySelector("#room_select").value;
                                        console.log(room);
                                        const person = document.querySelector("#person_select").value;
                                        console.log(person);
    
                                        const reserv_name = document.querySelector(".booker_input").value;
                                        console.log(reserv_name);
                                        const reserv_phone = document.querySelector(".phone_input").value;
                                        console.log(reserv_phone);
    
                                        const pay_way = pay_radio[i].value;
                                        console.log(pay_way);
    
                                        // 입력값에 대한 유효성 검사 진행 (생략)
    
                                        let json2 = null;
    
                                        try {
                                            const response = await axios.post("/reservation", {
                                                user_id: json.item.user_id,
                                                room: room,
                                                person: person,
                                                stay_start: start,
                                                stay_end: end,
                                                reserv_name: reserv_name,
                                                reserv_phone: reserv_phone,
                                                pay_way: pay_way,
                                                pay_price: total_price,
                                                order_no: rsp.merchant_uid
                                            });
    
                                            json2 = response.data;
    
                                        } catch (e) {
                                            alert(e.response.data.rtmsg);
                                            return;
                                        }
    
                                        if (json2 != null) {
                                            console.log(json2);
                                            // 새로 생성된 data의 PK를 상세 페이지로 전달하여 저장 결과 확인
                                            window.location = "/GJ16_reservation_clear_page/reservation_clear.html?reserv_id=" + json2.item[0].reserv_id;
                                        }
                                        } else {
                                            var msg = "결제에 실패하였습니다.";
                                            msg += "에러내용 : " + rsp.error_msg;
                                            history.back();
                                        }
                                        alert(msg);
                                    }
                                );
                            }
                        });
                } else if (pay_radio[i].value == "payco") {
                    document
                        .querySelector("#reservation")
                        .addEventListener("submit", (e) => {
                            e.preventDefault();
                            console.log("페이코");
                            if (regex()) {
                                IMP.init("imp52209533");
                                // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
                                // i'mport 관리자 페이지 -> 내정보 -> 가맹점식별코드
                                IMP.request_pay({
                                    pg: "payco",
                                    merchant_uid: "grandjeju" + new Date().getTime(),
                                    name: "GrandJeju",
                                    amount: total_price,
                                    buyer_name: buyer_name,
                                    buyer_tel: buyer_name,
                                    m_redirect_url: "https://www.yourdomain.com/payments/complete",
                                    /*
                                    모바일 결제시,
                                    결제가 끝나고 랜딩되는 URL을 지정
                                    (카카오페이, 페이코, 다날의 경우는 필요없음. PC와 마찬가지로 callback함수로 결과가 떨어짐)
                                    */
                                },
                                async (rsp) => {
                                    console.log(rsp);
                                    if (rsp.success) {
                                        var msg = "결제가 완료되었습니다.";
                                        msg += "고유ID : " + rsp.imp_uid;
                                        msg += "상점 거래ID : " + rsp.merchant_uid;
                                        msg += "결제 금액 : " + rsp.paid_amount;
                                        msg += "카드 승인번호 : " + rsp.apply_num;

                                        // 입력값 받아오기
                                    const room = document.querySelector("#room_select").value;
                                    console.log(room);
                                    const person = document.querySelector("#person_select").value;
                                    console.log(person);
    
                                    const reserv_name = document.querySelector(".booker_input").value;
                                    console.log(reserv_name);
                                    const reserv_phone = document.querySelector(".phone_input").value;
                                    console.log(reserv_phone);
    
                                    const pay_way = pay_radio[i].value;
                                    console.log(pay_way);
    
                                    // 입력값에 대한 유효성 검사 진행 (생략)
    
                                    let json2 = null;
    
                                    try {
                                        const response = await axios.post("/reservation", {
                                            user_id: json.item.user_id,
                                            room: room,
                                            person: person,
                                            stay_start: start,
                                            stay_end: end,
                                            reserv_name: reserv_name,
                                            reserv_phone: reserv_phone,
                                            pay_way: pay_way,
                                            pay_price: total_price,
                                            order_no: rsp.merchant_uid
                                        });
    
                                        json2 = response.data;
    
                                    } catch (e) {
                                        alert(e.response.data.rtmsg);
                                        return;
                                    }
    
                                    if (json2 != null) {
                                        console.log(json2);
                                        // 새로 생성된 data의 PK를 상세 페이지로 전달하여 저장 결과 확인
                                        window.location = "/GJ16_reservation_clear_page/reservation_clear.html?reserv_id=" + json2.item[0].reserv_id;
                                    }
                                    } else {
                                        var msg = "결제에 실패하였습니다.";
                                        msg += "에러내용 : " + rsp.error_msg;
                                        history.back();
                                    }
                                    alert(msg);
                                }
                                );
                            }
                        });
                } else if (pay_radio[i].value == "kakaopay"){
                    document
                        .querySelector("#reservation")
                        .addEventListener("submit", (e) => {
                            e.preventDefault();
                            console.log("카카오페이");
                            if (regex()) {
                                IMP.init("imp52209533");
                                // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
                                // i'mport 관리자 페이지 -> 내정보 -> 가맹점식별코드
                                IMP.request_pay({
                                    pg: "kakaopay", //카카오페이 결제창 호출
                                    merchant_uid: "grandjeju-" + new Date().getTime(),
                                    amount: total_price,
                                    name: "GrandJeju",
                                    buyer_name: buyer_name,
                                    m_redirect_url: "https://www.yourdomain.com/payments/complete",
                                    /*
                                    모바일 결제시,
                                    결제가 끝나고 랜딩되는 URL을 지정
                                    (카카오페이, 페이코, 다날의 경우는 필요없음. PC와 마찬가지로 callback함수로 결과가 떨어짐)
                                    */
                                },
                                async (rsp) => {
                                    console.log(rsp);
                                    if (rsp.success) {
                                        var msg = "결제가 완료되었습니다.";
                                        msg += "고유ID : " + rsp.imp_uid;
                                        msg += "상점 거래ID : " + rsp.merchant_uid;
                                        msg += "결제 금액 : " + rsp.paid_amount;
                                        msg += "카드 승인번호 : " + rsp.apply_num;

                                        // 입력값 받아오기
                                    const room = document.querySelector("#room_select").value;
                                    console.log(room);
                                    const person = document.querySelector("#person_select").value;
                                    console.log(person);
    
                                    const reserv_name = document.querySelector(".booker_input").value;
                                    console.log(reserv_name);
                                    const reserv_phone = document.querySelector(".phone_input").value;
                                    console.log(reserv_phone);
    
                                    const pay_way = pay_radio[i].value;
                                    console.log(pay_way);
    
                                    // 입력값에 대한 유효성 검사 진행 (생략)
    
                                    let json2 = null;
    
                                    try {
                                        const response = await axios.post("/reservation", {
                                            user_id: json.item.user_id,
                                            room: room,
                                            person: person,
                                            stay_start: start,
                                            stay_end: end,
                                            reserv_name: reserv_name,
                                            reserv_phone: reserv_phone,
                                            pay_way: pay_way,
                                            pay_price: total_price,
                                            order_no: rsp.merchant_uid
                                        });
    
                                        json2 = response.data;
    
                                    } catch (e) {
                                        alert(e.response.data.rtmsg);
                                        return;
                                    }
    
                                    if (json2 != null) {
                                        console.log(json2);
                                        // 새로 생성된 data의 PK를 상세 페이지로 전달하여 저장 결과 확인
                                        window.location = "/GJ16_reservation_clear_page/reservation_clear.html?reserv_id=" + json2.item[0].reserv_id;
                                    }
                                    } else {
                                        var msg = "결제에 실패하였습니다.";
                                        msg += "에러내용 : " + rsp.error_msg;
                                        history.back();
                                    }
                                    alert(msg);
                                    
                                }
                            );
                        }
                    });
                }
            });
        } 
    });  
    })();