// "data-include" 속성을 갖는 모든 요소에 대한 탐색
const dataInclude = document.querySelectorAll("*[data-include]");

dataInclude.forEach(async (v, i) => {
    const include = v.dataset.include;
    let html = null;
    
    try {
        const response = await axios.get(include);
        html = response.data;
    } catch (e) {
        console.error(e);
    }

    if (html != null) {
        v.outerHTML = html;
    }
});