/**
 * @filename    : reservation.js
 * @author      : 양수원 (ysw7939@gmail.com), 한송희 (onee.ssong@gmail.com)
 * @description : reservation 테이블에 대한 CRUD 기능을 수행하는 Restful API
 */

/** 모듈 참조 부분 */
const config = require('../../helper/_config');
const logger = require('../../helper/LogHelper');
const router = require('express').Router();
const mysql2  = require('mysql2/promise');
const regexHelper = require('../../helper/RegexHelper');
const utilHelper = require('../../helper/UtilHelper');
const BadRequestException = require('../../exceptions/BadRequestExeption');
const axios = require('axios');

/** 라우팅 정의 부분 */
module.exports = (app) => {
    let dbcon = null;

    /** 전체 목록 조회 --> Read(SELECT) */
    router.get("/reservation", async(req, res, next) => {

        // 검색어 파라미터 받기 -> 검색어가 없을 경우 전체 목록 조회이므로 유효성검사 안함
        const query = req.get('query');

        // 검색 종류 파라미터 받기 (기본값은 user_id)
        const search = req.get('search','user_id');

        // 현재 페이지 번호 받기 (기본값은 1)
        const page = req.get('page', 1);

        // 한 페이지에 보여줄 목록 수 받기 (기본값은 10, 최소 10, 최대 30)
        const rows = req.get('rows', 10);

        const order = req.get('order','desc');
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;
        let pagenation = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 전체 데이터 수를 조회
            let sql1 = 'SELECT COUNT(*) AS cnt FROM reservation';

            // SQL문에 설정할 치환값
            let args1 = [];
            
            if (query != null) {
                if (search == 'user_id'){
                    sql1 += " WHERE user_id LIKE concat('%', ?, '%')";
                    args1.push(query);
                } else if (search == 'reserv_name') {
                    sql1 += " WHERE reserv_name LIKE concat('%', ?, '%')";
                    args1.push(query);
                } else if (search == 'room') {
                    sql1 += " WHERE room LIKE concat('%', ?, '%')";
                    args1.push(query);
                }
            }

            
            const [result1] = await dbcon.query(sql1, args1);
            const totalCount = result1[0].cnt;


            // 페이지번호 정보를 계산한다.
            pagenation = utilHelper.pagenation(totalCount, page, rows);
            logger.debug(JSON.stringify(pagenation));
            

            // 데이터 조회
            let sql2 = "SELECT reserv_id, order_no, pay_no, pay_price, pay_way, date_format(reserv_date,'%Y/%m/%d %H:%i') as reserv_date, user_id, reserv_name, room, reserv_phone, person,  date_format(stay_start,'%Y-%m-%d') as stay_start,  date_format(stay_end,'%Y-%m-%d') as stay_end FROM reservation"

            // SQL문에 설정할 치환값
            let args2 = [];

            if (query != null) {
                if (search == 'user_id'){
                    sql2 += " WHERE user_id LIKE concat('%', ?, '%')";
                    args2.push(query);
                } else if (search == 'reserv_name') {
                    sql2 += " WHERE reserv_name LIKE concat('%', ?, '%')";
                    args2.push(query);
                } else if (search == 'room') {
                    sql2 += " WHERE room LIKE concat('%', ?, '%')";
                    args2.push(query);
                }
            }
            
            if (order != null) {
                if (order == 'asc'){
                    sql2 += " ORDER BY reserv_date asc"
                } else if (order == 'desc'){
                    sql2 += " ORDER BY reserv_date desc"
                }
            }

            sql2 += " LIMIT ?, ?"
            args2.push(pagenation.offset);
            args2.push(pagenation.listCount);

            const [result2] = await dbcon.query(sql2, args2);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result2;
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }
        
        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'pagenation': pagenation, 'item': json});
    });

    /** 특정 항목에 대한 상세 조회 --> Read(SELECT) */
    router.get("/reservation/:reserv_id", async(req, res, next) =>{
        const reserv_id = req.get('reserv_id');


        try {
            regexHelper.value(reserv_id, '요청 파라미터가 없습니다.');
        } catch (err) {
            return next(err);
        }
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 데이터 조회
            const sql = "SELECT reserv_id, order_no, pay_no, pay_price, pay_way, date_format(reserv_date,'%Y/%m/%d %H:%i') as reserv_date, user_id, reserv_name, room, reserv_phone, person, date_format(stay_start,'%Y-%m-%d') as stay_start, date_format(stay_end,'%Y-%m-%d') as stay_end  FROM reservation WHERE reserv_id=?";
            const [result] = await dbcon.query(sql, [reserv_id]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result;
        } catch (err) {
            next(err);
        } finally {
            dbcon.end();
        }

        //모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    /** 세션에 저장된 로그인 정보에 대한 상세 조회 --> Read(SELECT) */
    router.get("/reservationdetail/:user_id", async(req, res, next) =>{
        const user_id = req.get('user_id');

        const order = req.get('order','desc');

        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            regexHelper.value(user_id, '요청 파라미터가 없습니다.');
        } catch (err) {
            return next(err);
        }

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 데이터 조회
            let sql = "SELECT reserv_id, order_no, pay_no, pay_price, pay_way, date_format(reserv_date,'%Y/%m/%d %H:%i') as reserv_date, user_id, reserv_name, room, reserv_phone, person, date_format(stay_start,'%Y-%m-%d') as stay_start, date_format(stay_end,'%Y-%m-%d') as stay_end  FROM reservation WHERE user_id=?";

            let args = [];

            if (order != null) {
                if (order == 'asc'){                         
                    sql += " ORDER BY reserv_date asc"
                } else if (order == 'desc'){
                    sql += " ORDER BY reserv_date desc"
                }
            }
            const [result] = await dbcon.query(sql, [user_id], args);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result;
        } catch (err) {
            next(err);
        } finally {
            dbcon.end();
        }

        //모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    /** 데이터 중복 조회 */
    router.get("/reservationoverlap/:room", async(req, res, next) =>{
        // 저장을 위한 파라미터 입력받기
        const room = req.get('room');

        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            regexHelper.value(room, '선택된 객실이 없습니다.');
        } catch (err) {
            return next(err);
        }

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            let sql = 'SELECT stay_start, stay_end FROM reservation where room = ?';

            const [result] = await dbcon.query(sql, [room]);

            json = result;
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end(); // 저장 활성화 시 삭제해 주어야 함 
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    /** 데이터 추가 --> Create(INSERT) */
    router.post("/reservation", async(req, res, next) =>{
        // 저장을 위한 파라미터 입력받기
        const order_no = req.post('order_no');
        const pay_no = req.post('pay_no');
        const pay_price = req.post('pay_price');
        const pay_way = req.post('pay_way');
        const user_id = req.post('user_id');
        const reserv_name = req.post('reserv_name');
        const room = req.post('room');
        const reserv_phone = req.post('reserv_phone');
        const person = req.post('person');
        const stay_start = req.post('stay_start');
        const stay_end = req.post('stay_end');

        try {
            regexHelper.value(order_no, '주문 번호가 없습니다.');

            regexHelper.value(pay_no, '결제 번호가 없습니다.');

            regexHelper.value(pay_price, '결제 금액이 없습니다.');
            
            regexHelper.value(pay_way, '결제 방법이 없습니다.');
            
            regexHelper.value(user_id, '아이디가 없습니다.');
            
            regexHelper.value(reserv_name, '예약자명이 없습니다.');
            
            regexHelper.value(room, '객실이 없습니다.');
            
            regexHelper.value(reserv_phone, '예약자 연락처가 없습니다.');

            regexHelper.value(person, '인원이 없습니다.');
            
            regexHelper.value(stay_start, '입실일이 없습니다.');
            
            regexHelper.value(stay_end, '퇴실일이 없습니다.');
        } catch (err) {
            return next(err);
        }
        console.log(pay_price);

        /** 데이터 저장하기 */
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 전체 데이터 수를 조회 (중복 검사)
            let sql1 = 'SELECT COUNT(*) AS cnt FROM reservation WHERE stay_start=? AND stay_end=? AND room=?';
            let args1 = [stay_start, stay_end, room, sql1];

            const [result1] = await dbcon.query(sql1, args1);
            const totalCount = result1[0].cnt;

            if (totalCount > 0) {
                throw new BadRequestException('예약하실 수 없는 일정입니다. 다른 일정을 선택해 주세요.');
            }

            // 데이터 저장하기
            const sql2 = 'INSERT INTO reservation (order_no, pay_no, pay_price, pay_way, user_id, reserv_name, room, reserv_phone, person, stay_start, stay_end ) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
            const input_data = [order_no, pay_no, pay_price, pay_way, user_id, reserv_name, room, reserv_phone, person, stay_start, stay_end];
            const [result2] = await dbcon.query(sql2, input_data);

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql3 = "SELECT reserv_id, order_no, pay_no, pay_price, pay_way, date_format(reserv_date,'%Y/%m/%d %H:%i') as reserv_date, user_id, reserv_name, room, reserv_phone, person, stay_start, stay_end FROM reservation WHERE reserv_id=?";
            const [result3] = await dbcon.query(sql3, [result2.insertId]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result3
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    /** 데이터 수정 --> Update(UPDATE) */
    router.put("/reservation/:reserv_id", async (req, res,next) =>{
        const reserv_id = req.get('reserv_id');
        const user_id = req.post('user_id');
        const reserv_name = req.post('reserv_name');
        const room = req.post('room');
        const reserv_phone = req.post('reserv_phone');
        const person = req.post('person');
        const stay_start = req.post('stay_start');
        const stay_end = req.post('stay_end');
        

        try {
            regexHelper.value(reserv_id, '필수 파라미터가 없습니다.');
        } catch (err) {
            return next(err);
        }

        /** 데이터 수정하기 */
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;
        
        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 데이터 수정하기
            const sql = 'UPDATE reservation SET user_id=?, reserv_name=?, room=?, reserv_phone=?, person=?, stay_start=?, stay_end=? WHERE reserv_id=?';
            const input_data = [user_id, reserv_name, room, reserv_phone, person, stay_start, stay_end, reserv_id];
            const [result1] = await dbcon.query(sql, input_data);

            // 결과 행 수가 0이라면 예외처리
            if (result1.affectedRows < 1) {
                throw new Error('수정된 데이터가 없습니다.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = "SELECT reserv_id, order_no, pay_price, pay_way, date_format(reserv_date,'%Y/%m/%d %H:%i') as reserv_date, user_id, reserv_name, room, reserv_phone, person, stay_start, stay_end  FROM reservation WHERE reserv_id=?";
            const [result2] = await dbcon.query(sql2, [reserv_id]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result2;
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    })

    /** 데이터 삭제 --> Delete(DELETE) */
    router.delete("/reservation/:reserv_id", async (req, res,next) =>{
        const reserv_id = req.get('reserv_id');

        try {
            regexHelper.value(reserv_id, '요청 파라미터가 없습니다.');
        } catch (err) {
            return next(err);
        }
        
        /** 데이터 삭제하기 */
        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 삭제하고자 하는 원 데이터를 참조하는 자식 데이터를 먼저 삭제해야 한다.
            // 만약 자식데이터를 유지해야 한다면 참조키 값을 null로 업데이트 해야 한다.
            // 단, 자식 데이터는 결과행 수가 0이더라도 무시한다.
            // await dbcon.query("DELETE FROM student WHERE reserv_id=?", [reserv_id]);
            // 데이터 삭제하기
            const sql = 'DELETE FROM reservation WHERE reserv_id=?';
            const [result1] = await dbcon.query(sql, [reserv_id]);


            // 결과 행 수가 0이라면 예외처리
            if (result1.affectedRows < 1){
                throw new Error('삭제된 데이터가 없습니다.');
            }
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson();
    });

    /** 환불 */
    router.post('/payments/cancel/', async (req, res, next) => {
        const pk = req.post("reserv_id");
        console.log(pk);

        let json = null;

        // 결제번호
        let imp_uid = null;
        // 주문번호
        let merchant_uid = null;
        // 결제 금액
        let pay_price = null;
        // 환불 사유
        let reason = "고객 변심";

        try {
          // 데이터베이스 접속
          dbcon = await mysql2.createConnection(config.GJ_database);
          await dbcon.connect();

          // 데이터 조회
          let sql = "SELECT pay_no, order_no, pay_price FROM reservation WHERE reserv_id = ?";

          const [result] = await dbcon.query(sql, [pk]);
          console.log(result[0]);

          // 검색하여 조회한 결과 할당
          imp_uid = result[0].pay_no;
          merchant_uid = result[0].order_no;
          pay_price = result[0].pay_price;

          console.log(imp_uid);
          console.log(merchant_uid);
          console.log(pay_price);

      } catch (err) {
        next(err);
      }

      try {
          // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
            imp_key: "0019416345961328", // REST API 키
            imp_secret: "ee9f22bd3233449577256b77f6064b76b2f55f4cb5e3461c1baf9458ea6928175904cd0f590cab94" // REST API Secret
            }
        });

        const { access_token } = getToken.data.response; // 인증 토큰
        console.log(access_token);

        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token }, // 인증 토큰 Authorization header에 추가
        });

        // 조회한 결제 정보
        console.log(getPaymentData.data.response);

        const cancelableAmount = pay_price;
        console.log(cancelableAmount);
        if (cancelableAmount <= 0) {
            // 전액 환불이 완료된 경우
            return res.status(400).json({message: '이미 환불 완료된 내역입니다.'});
        }

        console.log(imp_uid);
        console.log(reason);
        
        /* 아임포트 REST API로 결제환불 요청 */
        const getCancelData = await axios({
            url: "https://api.iamport.kr/payments/cancel",
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "Authorization": access_token // 아임포트 서버로부터 발급받은 엑세스 토큰
            },
            data: {
              reason, // 가맹점 클라이언트로부터 받은 환불사유
              imp_uid, // imp_uid를 환불 `unique key`로 입력
            //   amount: cancel_request_amount, // 가맹점 클라이언트로부터 받은 환불금액
              checksum: cancelableAmount // [권장] 환불 가능 금액 입력
            }
        });

        console.log(getCancelData.data); // 환불 결과
        json = getCancelData.data;

        console.log(json);

      } catch (err) {
        next(err);
      } finally {
        dbcon.end();
    }

        //모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    return router;
}