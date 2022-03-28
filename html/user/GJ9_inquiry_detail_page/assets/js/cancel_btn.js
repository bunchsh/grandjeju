document.querySelector('.btn_delete').addEventListener('click', e => {
    swal({
        text: "정말 삭제하시겠습니까?", // Alert 내용
        buttons: {
            OK : true,  // 확인 버튼
            cancel: "cancel"    // 취소 버튼
        }
    }).then( async (value) => {   // 확인 버튼 이벤트
        console.log(value);
        if(value == 'OK'){
            try {
                const url = '/inquiry/' + inquiry_id;
                await axios.delete(url);
            } catch (e) {
                // 에러가 발생한 경우 벡엔드가 주는 json 받기
                
                alert(e);
                return;
            }
            window.location ="/GJ4_my_page/my.html"
        }
    });
})