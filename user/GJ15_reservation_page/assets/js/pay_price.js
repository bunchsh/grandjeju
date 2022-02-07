/**
 *  @filename    : pay_price.html
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : Grandjeju 예약하기 페이지의 결제 금액 출력과 아임포트를 통한 결제를 위한 함수 */

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
  var total_price =
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
              IMP.request_pay(
                {
                  pg: "html5_inicis",
                  pay_method: "card",
                  merchant_uid: "merchant_" + new Date().getTime(),
                  name: "GrandJeju",
                  amount: total_price,
                  buyer_name: buyer_name,
                  buyer_tel: buyer_tel,
                  m_redirect_url:
                    "https://www.yourdomain.com/payments/complete",
                  /*
                        모바일 결제시,
                        결제가 끝나고 랜딩되는 URL을 지정
                        (카카오페이, 페이코, 다날의 경우는 필요없음. PC와 마찬가지로 callback함수로 결과가 떨어짐)
                        */
                },
                function (rsp) {
                  console.log(rsp);
                  if (rsp.success) {
                    var msg = "결제가 완료되었습니다.";
                    msg += "고유ID : " + rsp.imp_uid;
                    msg += "상점 거래ID : " + rsp.merchant_uid; //결제번호
                    msg += "결제 금액 : " + rsp.paid_amount;
                    msg += "카드 승인번호 : " + rsp.apply_num;
                    location.href =
                      "../GJ16_reservation_clear_page/resevation_clear.html";
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
            regex();

            IMP.init("imp52209533");
            // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
            // i'mport 관리자 페이지 -> 내정보 -> 가맹점식별코드
            IMP.request_pay(
              {
                pg: "payco",
                merchant_uid: "merchant_" + new Date().getTime(),
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
              function (rsp) {
                console.log(rsp);
                if (rsp.success) {
                  var msg = "결제가 완료되었습니다.";
                  msg += "고유ID : " + rsp.imp_uid;
                  msg += "상점 거래ID : " + rsp.merchant_uid;
                  msg += "결제 금액 : " + rsp.paid_amount;
                  msg += "카드 승인번호 : " + rsp.apply_num;
                  location.href =
                    "../GJ16_reservation_clear_page/resevation_clear.html";
                } else {
                  var msg = "결제에 실패하였습니다.";
                  msg += "에러내용 : " + rsp.error_msg;
                  history.back();
                }
                alert(msg);
              }
            );
          });
      } else {
        document
          .querySelector("#reservation")
          .addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("카카오페이");
            regex();

            IMP.init("imp52209533");
            // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
            // i'mport 관리자 페이지 -> 내정보 -> 가맹점식별코드
            IMP.request_pay(
              {
                pg: "kakaopay", //카카오페이 결제창 호출
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
              function (rsp) {
                console.log(rsp);
                if (rsp.success) {
                  var msg = "결제가 완료되었습니다.";
                  msg += "고유ID : " + rsp.imp_uid;
                  msg += "상점 거래ID : " + rsp.merchant_uid;
                  msg += "결제 금액 : " + rsp.paid_amount;
                  msg += "카드 승인번호 : " + rsp.apply_num;
                  location.href =
                    "../GJ16_reservation_clear_page/resevation_clear.html";
                } else {
                  var msg = "결제에 실패하였습니다.";
                  msg += "에러내용 : " + rsp.error_msg;
                  history.back();
                }
                alert(msg);
              }
            );
          });
      }
    });
  }
});
