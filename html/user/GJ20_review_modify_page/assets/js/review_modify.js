document.querySelector('#review_write').addEventListener("submit", async(e) => {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const text = editor.getHTML();

    let json = null;
    let up = null;
    try { 
        const response = await axios.put("/review/" + review_id, {
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