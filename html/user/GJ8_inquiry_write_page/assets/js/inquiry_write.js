let json = null;
        (async () => {
            try {
                const response = await axios.get('/membersinfo');
                json = response.data
            } catch (e) {
                alert(e.response.data.rtmsg);
                // history.back();
                return;
            }
            console.log(json.item);
        })();
        
        document.querySelector('#inquiry_write').addEventListener('submit', async(e) => {
            e.preventDefault();
            
            const regexHelper = new RegexHelper();

            /** 문의 종류 검사 */
            if (!regexHelper.value(".inquiry_option", "문의 종류가 선택되지 않았습니다.")) {return false;}
            /** 제목 검사 */
            if (!regexHelper.value(".title_input", "제목을 입력되지 않았습니다.")) {return false;}
            /** 내용 검사 */
            if (!regexHelper.editor_value(editor.getHTML(), "내용이 입력되지 않았습니다.")) {return false;}

            
            console.log(json.item);
        
            const user_id = json.item.user_id;
            const user_name = json.item.user_name;
            const type = document.querySelector('#option').value;
            const title = document.querySelector("#title").value;
            const inquiry_text = editor.getHTML();

            let json2 = null;

            try {
                const response = await axios.post("/inquiry", {
                    user_id : user_id,
                    user_name : user_name,
                    type : type,
                    title : title,
                    inquiry_text : inquiry_text
                })
                json2 = response.data
                } catch (e) {
                    alert(e.response.data.rtmsg);
                    return;
                }
                console.log(json2);
                if (json2 != null) {
                    window.location ="/GJ9_inquiry_detail_page/inquiry_detail.html?inquiry_id=" + json2.item[0].inquiry_id;
                }
        })