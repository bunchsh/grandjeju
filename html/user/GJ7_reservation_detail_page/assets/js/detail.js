/**
 * @filename    : detail.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : 선택한 항목의 reserv_id를 통해 예약 내역을 조회해 출력하는 비동기 함수
 */



(async () => {
    let json = null;

    // 세션에 저장된 로그인 정보
    try {
        const response = await axios.get('/members/info');
        json = response.data;
    } catch (e) {
        alert(e.response.data.rtmsg);
        history.back();
        return;
    }

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
        let json2 = null;
    
        try {
            const response = await axios.get('/reservation/' + reserv_id);
            json2 = response.data;
        } catch (e) {
            alert(e.response.data.rtmsg);
            return;
        }
    
        if (json2.item.length == 0) {
            alert('조회할 예약 내역이 없습니다.');
            history.back();
            return;
        }
    
        if (json2 != null) {
            console.log(json2);
            console.log(json2.item[0].order_no);
            const source = document.querySelector("#content-template").innerHTML;
            const template = Handlebars.compile(source);
            const html = template(json2.item[0]);
    
            document.querySelector('#content').insertAdjacentHTML('beforeend', html);

             /** 예약 취소 Alert */
            document.getElementsByClassName("btn_cancel")[0].addEventListener('click', (e) => {
                swal({
                    text: "예약을 취소하시겠습니까?", // Alert 내용
                    buttons: {
                        confirm: "OK",  // 확인 버튼
                        cancel: true    // 취소 버튼
                    }
                }).then(() => {   // 확인 버튼 이벤트
                    // 즉시실행 비동기 처리 함수
                    const params = new URLSearchParams(window.location.search);
                        const reserv_id = params.get('reserv_id');

                        /** 환불 요청 */
                        function cancelPay() {
                            console.log("Jquery 진입");
                            jQuery.ajax({
                              "url": "http://172.28.5.5:3020/payments/cancel",
                              "type": "POST",
                              "contentType": "application/json",
                              "data": JSON.stringify({
                                "merchant_uid": json2.item[0].order_no,
                                "cancel_request_amount": json2.item[0].pay_price, // 환불금액
                                "reason": "테스트 결제 환불" // 환불사유
                              }),
                              "dataType": "json"
                            }).done(async (result) => { // 환불 성공시 로직 
                                alert("환불 성공");

                                // Ajax 요청 보내기 -> 백엔드가 전달한 결과값이 response.data에 저장된다.
                                const response = await axios.delete("/reservation/" + reserv_id);
                                // 백엔드에서 전달된 결과가 로그인 성공을 의미하는 경우
                                swal({
                                    text: "예약 취소가 완료되었습니다.", // Alert 내용
                                    buttons: {
                                        confirm: "OK",  // 확인 버튼
                                    }
                                }).then(() => {
                                    window.location = "/GJ4_my_page/my.html"
                                });
                              }).fail((error) => { // 환불 실패시 로직
                                swal({
                                    text: "환불 실패", // Alert 내용
                                    buttons: {
                                        confirm: "OK",  // 확인 버튼
                                    }
                                })
                              });
                          };
                });
            });
        }
    })();

})();