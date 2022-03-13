let login_info = null;
let complete = false;
(async () => {
    try {
        const response = await axios.get('/members/info');
        login_info = response.data
    } catch (e) {
        swal({
            text: e.response.data.rtmsg, // Alert 내용
            buttons: {
                OK: true,  // 확인 버튼
            }
        });
        return;
    }
    console.log(login_info.item);
})();
document.querySelector('#review_write').addEventListener("submit", async(e) => {
    e.preventDefault();

    const regexHelper = new RegexHelper();

    /** 제목 검사 */
    if (!regexHelper.value("#title", "제목을 입력되지 않았습니다.")) {return false;}
    /** 내용 검사 */
    if (!regexHelper.editor_value(editor.getHTML(), "내용이 입력되지 않았습니다.")) {return false;}

    const user_name = login_info.item.user_name;
    const user_id = login_info.item.user_id;
    const title = document.querySelector("#title").value;
    const text = editor.getHTML();

    let json = null;
    let up = null;
    try { 
        const response = await axios.post("/review", {
            user_name : user_name,
            user_id : user_id,
            title : title,
            text : text,
            photos : id_array
        });
        json = response.data;


    } catch (e) {
        swal({
        text: e.response.data.rtmsg, // Alert 내용
        buttons: {
            OK: true,  // 확인 버튼
        }
    });
        return;
    }

    if(json != null) {

        window.location ="/GJ19_review_datail_page/review_detail.html?review_id=" + json.item[0].review_id;
    }
})