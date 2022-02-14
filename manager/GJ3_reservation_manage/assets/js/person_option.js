/** 
 *  @filename    : person_option.js
 * @author      : 한송희 (onee.ssong@gmail.com)
 * @description : Grandjeju 관리자 예약 수정 페이지의 객실 선택 시, 객실에 따른 선택 가능 인원 출력을 위한 함수 */

/** 객실 선택 시, 객실에 따른 선택 가능 인원 출력 */
function roomPerson(e) {
    
    let maxfour = ["2", "3", "4"];
    let maxsix = ["2", "3", "4"];
    let maxseven = ["2", "3", "4", "5"];
    let maxeight = ["2", "3", "4", "5"];
    let target = document.getElementById("person");

    if (e == "35M" || e.value =="35M") var option = maxfour;
    else if (e == "35O" || e.value =="35O") var option = maxfour;
    else if (e == "50M" || e.value =="50M") var option = maxsix;
    else if (e == "70O" || e.value =="70O") var option = maxseven;
    else if (e == "85M" || e.value =="85M") var option = maxeight;

    target.options.length = 0;

    for (x in option) {
        console.log("안녕")
        let opt = document.createElement("option");
        opt.value = option[x];  // option의 value
        opt.innerHTML = option[x] + "명";
        opt.dataset.price = [x] * 10000; // 기준 인원 이상 시, 10000원씩 추가
        target.appendChild(opt);
    }
}