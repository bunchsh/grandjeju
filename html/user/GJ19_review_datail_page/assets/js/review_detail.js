 // GET 파라미터 받기
 const params = new URLSearchParams(window.location.search);
 let review_id = params.get('review_id');

 (async () => {
     

     const title = document.querySelector(".review_title")
     const text = document.querySelector(".text")
     const btn_group = document.querySelector(".btn_group")

     let json_review = null;
     let json_login = null;
     try {
         const response1 = await axios.get('/review/' + review_id)
         const response2 = await axios.get('/members/info');
         json_review = response1.data
         json_login = response2.data
     }catch (e) {
         swal({
         text: e.response.data.rtmsg, // Alert 내용
         buttons: {
             OK: true,  // 확인 버튼
             }
         }).then((value) => {   // 확인 버튼 이벤트
             if (value == 'OK') {
             return;
             }
         });
     }
     if(json_review != null) {
         console.log(json_review);
         title.innerHTML = json_review.item[0].title;
         text.innerHTML = json_review.item[0].text
     }

     if (json_review.item[0].user_id == json_login.item.user_id) {
         btn_group.innerHTML = ('afterbegin',
             `
             <button class="btn_modify" type="button"><a href="/GJ20_review_modify_page/review_modify.html?review_id=${review_id}">수정</a></button>
             <button class="btn_delete" type="button">삭제</button>
             `
         )
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
                         const url = '/review/' + review_id;
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
     }
 })();