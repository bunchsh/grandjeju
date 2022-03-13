let id_array = []

document.querySelector('#photo_img').addEventListener('change', async (e) => {
    const files = e.target.files;
    const keys = Object.keys(files);

    // 현제 에디터의 작성 내용 저장
    let get_editor = editor.getHTML()

    console.log(get_editor);
    console.log(files)

    // javascript로 가상의 form을 생성
    const form = new FormData();
    // 가상의 폼에 input요소 추가
    form.append('photo_img', files[0]);
    

    keys.forEach((i, v) => {
        // javascript로 가상의 form을 생성
        const form = new FormData();
        // 가상의 폼에 input요소 추가
        form.append('photo_img', files[v]);
        
        (async () => {
            try {
                const response = await axios.post("/photo", form);
                console.log(response.data);
                json = response.data

                
                keys.forEach(v => {
                    console.log(get_editor);
                    
                    // 기존 에디터의 작성내용 + 새로 추가된 이미지
                    editor.setHTML(`${get_editor}<img src='${json.item[0].path}'/>`);

                    // 파일 테이블에 저장된 pk값 배열로 저장
                    id_array.push(json.item[0].photo_id)
                });


            } catch (error) {
                console.error(error);
            }
        })();
    });
})