/**
 * department 테이블에 대한 CRUD 기능을 수행하는 Restful API
 */

/** 모듈 참조 부분 */
const config = require('../../helper/_config');
const logger = require('../../helper/LogHelper');
const router = require('express').Router();
const mysql2  = require('mysql2/promise');
const regexHelper = require('../../helper/RegexHelper');
const utilHelper = require('../../helper/UtilHelper');

/** 라우팅 정의 부분 */
module.exports = (app) => {
    let dbcon = null;

    /** 전체 목록 조회 --> Read(SELECT) */
    router.get("/members", async(req, res, next) => {

        // 검색어 파라미터 받기 -> 검색어가 없을 경우 전체 목록 조회이므로 유효성검사 안함
        const query = req.get('query');

        // 검색 종류 파라미터 받기 (기본값은 user_id)
        const search = req.get('search','user_id');

        // 현재 페이지 번호 받기 (기본값은 1)
        const page = req.get('page', 1);

        // 한 페이지에 보여줄 목록 수 받기 (기본값은 10, 최소 10, 최대 30)
        const rows = req.get('rows', 10);

        const order = req.get('order');
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;
        let pagenation = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 전체 데이터 수를 조회
            let sql1 = 'SELECT COUNT(*) AS cnt FROM members';

            // SQL문에 설정할 치환값
            let args1 = [];
            
            if (query != null) {
                if (search == 'user_id'){
                    sql1 += " WHERE user_id LIKE concat('%', ?, '%')";
                    args1.push(query);
                } else if (search == 'user_name') {
                    sql1 += " WHERE user_name LIKE concat('%', ?, '%')";
                    args1.push(query);
                } else if (search == 'user_phone') {
                    sql1 += " WHERE user_phone LIKE concat('%', ?, '%')";
                    args1.push(query);
                }
            }



            const [result1] = await dbcon.query(sql1, args1);
            const totalCount = result1[0].cnt;


            // 페이지번호 정보를 계산한다.
            pagenation = utilHelper.pagenation(totalCount, page, rows);
            logger.debug(JSON.stringify(pagenation));
            

            // 데이터 조회
            let sql2 = "SELECT member_id, user_id, user_pw, user_name, user_phone, is_admin, date_format(reg_date,'%Y/%m/%d %H:%i') as reg_date  FROM members"

            // SQL문에 설정할 치환값
            let args2 = [];

            if (query != null) {
                if( search == 'user_id'){
                    sql2 += " WHERE user_id LIKE concat('%', ?, '%')";
                    args2.push(query);
                } else if (search == 'user_name') {
                    sql2 += " WHERE user_name LIKE concat('%', ?, '%')";
                    args2.push(query);
                } else if (search == 'user_phone') {
                    sql2 += " WHERE user_phone LIKE concat('%', ?, '%')";
                    args2.push(query);
                }
            }
            
            if (order != null) {
                if (order == 'asc'){
                    sql2 += " ORDER BY user_name asc"
                } else if (order == 'desc'){
                    sql2 += " ORDER BY user_name desc"
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
    router.get("/members/:member_id", async(req, res, next) =>{
        const member_id = req.get('member_id');


        try {
            regexHelper.value(member_id, '요청 파라미터가 없습니다.');
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
            const sql = 'SELECT member_id, user_id, user_pw, user_name, user_phone, is_admin, reg_date FROM members WHERE member_id=?';
            const [result] = await dbcon.query(sql, [member_id]);

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

    /** 데이터 추가 --> Create(INSERT) */
    router.post("/members", async(req, res, next) =>{
        // 저장을 위한 파라미터 입력받기
        const user_id = req.post('user_id');
        const user_pw = req.post('user_pw');
        const user_name = req.post('user_name');
        const user_phone = req.post('user_phone');

        try {
            regexHelper.value(user_pw, '아이디가 없습니다.');
        } catch (err) {
            return next(err);
        }

        /** 데이터 저장하기 */
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 데이터 저장하기
            const sql = 'INSERT INTO members (user_id, user_pw, user_name, user_phone) VALUES (?,?,?,?)';
            const input_data = [user_id, user_pw, user_name, user_phone];
            const [result1] = await dbcon.query(sql, input_data);

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = 'SELECT member_id, user_id, user_pw, user_name, user_phone, is_admin reg_date  FROM members where member_id=?';
            const [result2] = await dbcon.query(sql2, [result1.insertId]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result2
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    /** 데이터 수정 --> Update(UPDATE) */
    router.put("/members/:member_id", async (req, res,next) =>{
        const member_id = req.get('member_id');
        const user_id = req.post('user_id');
        const user_pw = req.post('user_pw');
        const user_name = req.post('user_name');
        const user_phone = req.post('user_phone');
        

        try {
            regexHelper.value(member_id, '필수 파라미터가 없습니다.');
            regexHelper.value(user_id, '교수이름이 없습니다.');
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
            const sql = 'UPDATE members SET user_id=?, user_pw=?, user_name=?, user_phone=? WHERE member_id=?';
            const input_data = [user_id, user_pw, user_name, user_phone, member_id];
            const [result1] = await dbcon.query(sql, input_data);

            // 결과 행 수가 0이라면 예외처리
            if (result1.affectedRows < 1) {
                throw new Error('수정된 데이터가 없습니다.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = 'SELECT member_id, user_id, user_pw, user_name, user_phone, is_admin, reg_date FROM members where member_id=?';
            const [result2] = await dbcon.query(sql2, [member_id]);

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
    router.delete("/members/:member_id", async (req, res,next) =>{
        const member_id = req.get('member_id');

        try {
            regexHelper.value(member_id, '요청 파라미터가 없습니다.');
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
            // await dbcon.query("DELETE FROM student WHERE member_id=?", [member_id]);
            // 데이터 삭제하기
            const sql = 'DELETE FROM members WHERE member_id=?';
            const [result1] = await dbcon.query(sql, [member_id]);


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

    /* 회원가입, 로그인 ,로그아웃 로직 시작 */

    router.post("/members/login", async(req, res, next) => {
        // 파라미터 받기
        const user_id = req.post('user_id');
        const user_pw = req.post('user_pw');

        try {
            // 아이디와 비밀번호를 유추하는데 흰트가 될 수 있으므로
            // 유효성 검사는 입력 여부만 확인한다.
            regexHelper.value(user_id, '아이디를 입력하세요.');
            regexHelper.value(user_pw, '비밀번호를 입력하세요.');
        } catch(err){
            return next(err);
        }

        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 아이디와 비밀번호가 일치하는 데이터를 조회 (조회결과에서 비밀번호는 제외)
            let sql1 = "SELECT member_id, user_id, user_pw, user_name, user_phone, is_admin, date_format(reg_date,'%Y/%m/%d %H:%i') as reg_date  FROM members WHERE user_id =? AND user_pw=?" ;
            let args1 = [user_id, user_pw];

            const [result1] = await dbcon.query(sql1, args1);

            // 조회된 회원정보 객체를 저장하고 있는 1차원 배열(원소는 1개)
            json = result1;

            // login_date값을 now()로 update처리
            let sql2 = "UPDATE members SET login_date=now() WHERE id=?"
            dbcon.query(sql2, json[0].id);
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 조회된 데이터가 없다면? WHERE절이 맞지 않다는 의미 -> 아이디,비번 틀림
        if(json == null || json.length == 0) {
            return next(new BadRequestException('아이디나 비밀번호가 잘못되었습니다.'));
        }

        // 탈퇴한 회원은 로그인 금지
        if(json[0].is_admin == 'Y') {
            return next(new BadRequestException('탈퇴한 회원입니다.'));
        }

        // 조회 결과를 세션에 저장 
        req.session.memberInfo = json[0];

        res.sendJson();
    });
    return router;
}