/**
 * @filename    : review_pagination.js
 * @author      : 양수원 (ysw7939@gmail.com) 
 * @description : pagination 구현을 위한 함수
 */

/** 페이지 번호 구현 함수 */
function pagenation(selector, data) {
    // 페이지 번호가 출력될 대상
    const container = document.querySelector(selector);

    // 1) 이전 그룹 링크 : <li class="page-item"><a class="page-link" href="#">&laquo;</a><li>
    const li1 = document.createElement("li");
    li1.classList.add("page-item");

    const a1 = document.createElement("a");
    a1.innerHTML = "&laquo;";
    a1.classList.add("page-link");
    a1.setAttribute("href", `/GJ4_review_manage_page/review_manage.html?search=${search}&page=${data.prevGroupLastPage}&query=${query}&order=${order}`);


    if (data.prevGroupLastPage == 0) {
        li1.classList.add('disabled');
        a1.removeAttribute('href');
    }

    li1.appendChild(a1);
    container.appendChild(li1);

    // 2) 페이지번호 링크들 : <li class="page-item"><a class="page-link" href="#">3</a><li>
    for (let i = data.groupStart; i <= data.groupEnd; i++) {
        const li2 = document.createElement("li");
        li2.classList.add('page-item');

        const a2 = document.createElement("a");
        a2.innerHTML = i;
        a2.classList.add('page-link');
        a2.setAttribute("href", `/GJ4_review_manage_page/review_manage.html?search=${search}&page=${i}&query=${query}&order=${order}`);

        if (data.nowPage == i) {
            li2.classList.add('active');
        }

        li2.appendChild(a2);
        container.appendChild(li2);
    }

    // 3) 다음 그룹 링크 : <li class="page-item"><a class="page-link" href="#">&raquo;</a><li>
    const li3 = document.createElement("li");
    li3.classList.add("page-item");

    const a3 = document.createElement("a");
    a3.innerHTML = "&raquo;";
    a3.classList.add("page-link");
    a3.setAttribute("href", `/GJ4_review_manage_page/review_manage.html?search=${search}&page=${data.nextGroupFirstPage}&query=${query}&order=${order}`);



    if (data.nextGroupFirstPage == 0) {
        li3.classList.add('disabled');
        a3.removeAttribute('href');
    }

    li3.appendChild(a3);
    container.appendChild(li3);
}