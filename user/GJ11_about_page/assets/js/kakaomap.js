// @filename    : kakaomap.js
// @author      : 한송희 (onee.ssong@gmail.com)
// @description : Grandjeju kakaomap 구현

const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런s스
const options = { //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(33.448583, 126.304385), //지도의 중심좌표.
    level: 3 //지도의 레벨(확대, 축소 정도)
};

const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

// 마커가 표시될 위치입니다 
const markerPosition = new kakao.maps.LatLng(33.448583, 126.304385);

// 마커를 생성합니다
const marker = new kakao.maps.Marker({
    position: markerPosition
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);