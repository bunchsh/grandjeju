# GrandJeju
> 펜션 예약 웹 사이트 프로젝트
<br />

## TEAM
👩‍💻 양수원 (ysw7939) <br />
👨‍💻 한송희 (bunchsh)

## 개발 환경
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)


## Languages
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)


## Project schedule
### 총 기간: 2021-12-06 ~ 2022-04-03
- 12월 1주차: 기획, 요구사항 정의
- 12월 2주차: 요구사항 명세
- 12월 3주차 ~ 1월 1주차: 목업 및 프로토 타이핑
- 1월 2주차: Story Board
- 1월 3주차 ~ 2월 1주차: FrontEnd 작업 (HTML / CSS / JavaScript / BootStrap)
- 2월 2주차: DataBase 설계
- 2월 3주차 ~ 3월 3주차: BackEnd 작업 (Node.js / MySQL)
- 3월 4주차: Test 및 Release
- 4월 1주차: 포트폴리오 작업

---

## FrontEnd

### 목업
> Ipad의 Good Note를 사용하여 작업
<img width="80%" src="https://user-images.githubusercontent.com/91588367/169693970-b1d57217-cdd8-4758-904f-62007a7771f1.jpg"/>

### 프로토 타이핑
<img width="80%" src="https://user-images.githubusercontent.com/91588367/169694043-54417a10-14ed-422c-bf5a-5a82b0f7b5f3.png"/>

### Style Guide
<img width="80%" src="https://user-images.githubusercontent.com/91588367/169694017-bad69f06-2c5e-4c53-baf3-d66fefe9eacc.png"/>

### 주요 개발 기능
#### 유효성 검사
> JavaScript를 사용하여 정해진 유효성 검사의 조건을 충족하는 값들만 입력되어 저장되도록 구현하였으며, 결제 수단 미선택 및 에디터 내용 미입력 등의 유효성 검사를 추가적으로 구현하였습니다.
#### 예약 날짜 중복 방지
> 예약 날짜 캘린더는 JavaScript 라이브러리 중, flatpickr를 사용하였으며 해당 기능 역시 JavaScript를 사용하였습니다. DataBase와의 연동을 통해 DataBase에 이미 그 날짜의 예약건이 유효하다면 그 기간의 날짜 선택을 비활성화되도록 구현하였습니다.
#### 아임 포트 결제
> 결제 기능은 아임 포트를 사용하였으며, 아임 포트의 공식 메뉴얼을 참고하여 구현하였습니다. 신용카드(이니시스), 페이코, 카카오페이로 결제가 되도록 하였으며, 선택한 결제 수단으로 결제가 되도록 유도하여 결제가 되도록 하였습니다. (현재, 포트폴리오용 프로젝트이므로 결제는 테스트로 작동합니다.)

---

## BackEnd

### 테이블 명세서
<img width="80%" src="https://user-images.githubusercontent.com/91588367/169694445-8832cbbf-cc21-4ba5-b3b8-7a976326ab80.png"/>
<img width="80%" src="https://user-images.githubusercontent.com/91588367/169694461-279167ba-c84a-430d-95c9-f9228a088ae1.png"/>

### ERD
<img width="80%" src="https://user-images.githubusercontent.com/91588367/169694482-d5053210-4354-4221-a8b4-486cfe80c822.png"/>

### 주요 개발 기능
#### API 생성 및 사용
> 회원 가입, 예약, 리뷰 등의 내용들이 DataBase에 저장되어 저장되어 있는 내용들을 API로 생성하여 그대로 API로 사용해 실제로 사이트에서 확인되고 사용할 수 있도록 구현하였습니다.
#### 파일 업로드
> 가상의 form 요소에 파일 객체를 추가하여, BackEnd 상에 업로드되어 DataBase에 저장되어서 API로서 사용되게끔 구현하였습니다.
#### 로그인 및 회원 가입, 회원 수정 기능
> 로그인의 경우, 전송받은 아이디와 비밀번호를 회원 테이블에서 조회 후, 맞는 회원 정보라면 로그인이 되어 세션에 저장되며, 맞지 않는다면 다시 작성하라는 에러 메시지가 발생하도록 구현하였습니다.
> 회원 가입의 경우, 전송된 회원 정보의 유효성을 검사한 후에 중복되는 아이디가 없는 지 회원 테이블에서 검색 후, 없다면 회원 테이블에 저장되도록 구현하였습니다.
> 회원 정보 수정 기능의 경우, 현재 세션에 저장되어 있는 회원 정보를 회원 테이블에서 검색한 후에 원하는 항목을 수정하고서 저장하게 되면 저장된 내용이 회원 테이블에 수정되어 저장되도록 구현하였습니다.
#### 예약 내역 저장
> 예약 form 요소에서 입력되어 전송된 내역들을 예약 테이블에 저장되도록 구현하였으며, 이는 FrontEnd의 예약 날짜 중복 방지 기능에서도 API로 사용되게 됩니다.

---

## Release
- User Page: http://grandjeju.cafe24app.com/GJ1_main_page/main.html
- Manager Page: http://grandjeju.cafe24app.com/GJ1_login_page/login.html
