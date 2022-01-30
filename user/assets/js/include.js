document.querySelectorAll("*[data-include]").forEach(async (v,i) => {
    console.log("인크루드 시작")
    const include = v.dataset.include;
    let html = null;

    try {
        const response = await axios.get(include);
        html = response.data;
    } catch (e) {
        console.error(e);
    }

    if(html != null) {
        v.outerHTML = html;
    }
    console.log("인클루드 끝");
    loadScript("../assets/js/side_menu.js");
});

// 사이드 메뉴를 동작하게하는 스크립트태그를 생성하는 함수
function loadScript (src){
    let script = document.createElement('script');
    script.src = src;
    document.body.append(script);
};

