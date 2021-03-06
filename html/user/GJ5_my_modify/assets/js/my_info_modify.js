/**
 * @filename    : my_info_modify.js
 * @author      : 한송희 (onee.ssong@gmail.com) 
 * @description : 로그인된 회원 정보를 조회하여 각 항목의 정보들을 출력하고 수정하여 저장
 */

(async () => {
    let json = null;

    // 세션에 저장된 로그인 정보
    try {
        const response = await axios.get('/membersinfo');
        json = response.data;
    } catch (e) {
        swal({
            text: e.response.data.rtmsg, // Alert 내용
            buttons: {
                OK: true,  // 확인 버튼
            }
        }).then((value) => {   // 확인 버튼 이벤트
            if (value == 'OK') {
                history.back();
                return;
            };
        });
        
    }

    let member_id = json.item.member_id;

    if (json != null) {

        (async () => {

            /** 입력을 위한 input 태그 객체 */
            const inputUserid = document.querySelector(".modify_id");
            const inputPw = document.querySelector(".modify_pw");
            const inputName = document.querySelector(".modify_name");
            const inputUserphone = document.querySelector(".modify_tel");

            if (!member_id) {
                swal({
                    text: '회원 정보가 없습니다.', // Alert 내용
                    buttons: {
                        OK: true,  // 확인 버튼
                    }
                }).then((value) => {   // 확인 버튼 이벤트
                    if (value == 'OK') {
                        history.back();
                        return;
                    };
                });
            }


            /** 수정 form에 기존의 데이터를 표시하기 위해 Ajax로 저장된 데이터를 조회해야 함 */
            let json2 = null;

            try {
                const response = await axios.get('/members/' + member_id);
                json2 = response.data;
            } catch (e) {
                swal({
                    text: e.response.data.rtmsg, // Alert 내용
                    buttons: {
                        OK: true,  // 확인 버튼
                    }
                }).then((value) => {   // 확인 버튼 이벤트
                    if (value == 'OK') {
                        return;
                    };
                });
            }

            // 조회 결과가 있다면 input 태그에 조회 데이터 세팅
            if (json2 != null) {
                console.log(json2.item[0]);
                inputUserid.value = json2.item[0].user_id;
                inputPw.value = json2.item[0].user_pw;
                inputName.value = json2.item[0].user_name;
                inputUserphone.value = json2.item[0].user_phone;
            }

        })();

        /** 수정 완료 후, submit 이벤트가 발생한 경우 */
        document.querySelector("#modify_form_group").addEventListener("submit", async (e) => {
            e.preventDefault();

            // 입력값 받아오기
            const user_id = document.querySelector(".modify_id").value;
            const user_pw = document.querySelector(".modify_pw").value;
            const user_pwre = document.querySelector(".modify_pw_re").value;
            const user_name = document.querySelector(".modify_name").value;
            const user_phone = document.querySelector(".modify_tel").value;

            if (!user_pwre) {
                return;
            }

            let json3 = null;

            try {
                const response = await axios.put("/members/" + member_id, {
                    user_id: user_id,
                    user_pw: user_pw,
                    user_name: user_name,
                    user_phone: user_phone
                });

                json3 = response.data;
            } catch (e) {
                swal({
                    text: e.response.data.rtmsg, // Alert 내용
                    buttons: {
                        OK: true,  // 확인 버튼
                    }
                }).then((value) => {   // 확인 버튼 이벤트
                    if (value == 'OK') {
                        return;
                    };
                });
            }

            if (json3 != null) {
                swal({
                    text: '회원 정보 수정이 완료되었습니다. \n 다시 로그인해 주세요.', // Alert 내용
                    buttons: {
                        OK: true,  // 확인 버튼
                    }
                }).then((value) => {   // 확인 버튼 이벤트
                    if (value == 'OK') {
                        /** 세션의 로그인 data 갱신을 위해 강제 로그아웃 */
                        (async () => {
                            try {
                                // Ajax 요청 보내기 -> 백엔드가 전달한 결과값이 response.data에 저장된다.
                                const response = await axios.delete("/members/logout");
                            } catch (error) {
                                const errorMsg = "[" + error.response.status + "] " + error.response.statusText
                                console.error(errorMsg);
                                swal({
                                    text: "로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.", // Alert 내용
                                    buttons: {
                                        OK: true,  // 확인 버튼
                                    }
                                });
                                history.back();
                            }
                        })();
                        window.location = "/GJ2_login_page/login.html"
                    };
                });

            }
        });
    }

})();