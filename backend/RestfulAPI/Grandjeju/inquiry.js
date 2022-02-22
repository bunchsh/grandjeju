/**
 * @filename    : inquiry.js
 * @author      : 양수원 (ysw7939@gmail.com), 한송희 (onee.ssong@gmail.com)
 * @description : inquiry 테이블에 대한 CRUD 기능을 수행하는 Restful API
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
    router.get("/inquiry", async(req, res, next) => {

        // 검색어 파라미터 받기 -> 검색어가 없을 경우 전체 목록 조회이므로 유효성검사 안함
        const query = req.get('query');

        // 검색 종류 파라미터 받기 (기본값은 user_id)
        const search = req.get('search','user_id');

        // 현재 페이지 번호 받기 (기본값은 1)
        const page = req.get('page', 1);

        // 한 페이지에 보여줄 목록 수 받기 (기본값은 10, 최소 10, 최대 30)
        const rows = req.get('rows', 10);

        const search_state = req.get('search_state',);

        const search_type = req.get('search_type');

        const order = req.get('order','desc');
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;
        let pagenation = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 전체 데이터 수를 조회
            let sql1 = 'SELECT COUNT(*) AS cnt FROM inquiry';

            // SQL문에 설정할 치환값
            let args1 = [];
            
            if (query != null) {
                if (search == 'title'){
                    sql1 += " WHERE title LIKE concat('%', ?, '%')";
                    args1.push(query);
                } else if (search == 'user_name') {
                    sql1 += " WHERE user_name LIKE concat('%', ?, '%')";
                    args1.push(query);
                }
                if (search_state != null) {
                    sql1 += " AND state=?"
                    args1.push(search_state);
                }
    
                if (search_type != null) {
                    sql1 += " AND type=?"
                    args1.push(search_type);
                }
            } else if (search_state != null) {
                sql1 += " WHERE state=?"
                args1.push(search_state);

                if (search_type != null) {
                    sql1 += " AND type=?"
                    args1.push(search_type);
                }
            } else if (search_type != null) {
                sql1 += " WHERE type=?"
                args1.push(search_type)
            }
            

            

            const [result1] = await dbcon.query(sql1, args1);
            const totalCount = result1[0].cnt;


            // 페이지번호 정보를 계산한다.
            pagenation = utilHelper.pagenation(totalCount, page, rows);
            logger.debug(JSON.stringify(pagenation));
            

            // 데이터 조회
            let sql2 = "SELECT inquiry_id, user_id, user_name, type, title, CONVERT(inquiry_text USING utf8) as inquiry_text, CONVERT(answer_text USING utf8) as answer_text, date_format(inquiry_date,'%Y-%m-%d') inquiry_date, date_format(answer_date,'%Y-%m-%d') answer_date, state  FROM inquiry"

            // SQL문에 설정할 치환값
            let args2 = [];

            if (query != null) {
                if (search == 'title'){
                    sql2 += " WHERE title LIKE concat('%', ?, '%')";
                    args2.push(query);
                } else if (search == 'user_name') {
                    sql2 += " WHERE user_name LIKE concat('%', ?, '%')";
                    args2.push(query);
                }
                if (search_state != null) {
                    sql2 += " AND state=?"
                    args2.push(search_state);
                }
    
                if (search_type != null) {
                    sql2 += " AND type=?"
                    args2.push(search_type);
                }
            } else if (search_state != null) {
                sql2 += " WHERE state=?"
                args2.push(search_state);
                
                if (search_type != null) {
                    sql2 += " AND type=?"
                    args2.push(search_type);
                }
            } else if (search_type != null) {
                sql2 += " WHERE type=?"
                args2.push(search_type)
            }
            
            if (order != null) {
                if (order == 'asc'){
                    sql2 += " ORDER BY inquiry_date asc"
                } else if (order == 'desc'){
                    sql2 += " ORDER BY inquiry_date desc"
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
    router.get("/inquiry/:inquiry_id", async(req, res, next) =>{
        const inquiry_id = req.get('inquiry_id');


        try {
            regexHelper.value(inquiry_id, '요청 파라미터가 없습니다.');
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
            const sql = "SELECT inquiry_id, user_id, user_name, type, title, CONVERT(inquiry_text USING utf8) as inquiry_text, CONVERT(answer_text USING utf8) as answer_text, date_format(inquiry_date,'%Y-%m-%d') inquiry_date, date_format(answer_date,'%Y-%m-%d') answer_date, state  FROM inquiry WHERE inquiry_id=?";
            const [result] = await dbcon.query(sql, [inquiry_id]);

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
    router.get("/inquirydetail/:user_id", async(req, res, next) =>{
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
            let sql = "SELECT inquiry_id, user_id, user_name, type, title, CONVERT(inquiry_text USING utf8) as inquiry_text, CONVERT(answer_text USING utf8) as answer_text, date_format(inquiry_date,'%Y-%m-%d') inquiry_date, date_format(answer_date,'%Y-%m-%d') answer_date, state FROM inquiry WHERE user_id=?";

            let args = [];

            if (order != null) {
                if (order == 'asc'){
                    sql += " ORDER BY inquiry_date asc"
                } else if (order == 'desc'){
                    sql += " ORDER BY inquiry_date desc"
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

    /** 문의 데이터 추가 --> Create(INSERT) */
    router.post("/inquiry", async(req, res, next) =>{
        // 저장을 위한 파라미터 입력받기
        const user_id = req.post('user_id');
        const user_name = req.post('user_name');
        const type = req.post('type');
        const title = req.post('title');
        const inquiry_text = req.post('inquiry_text');

        try {
            regexHelper.value(user_id, '아이디가 없습니다.');
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
            const sql = 'INSERT INTO inquiry (user_id, user_name, type, title, inquiry_text) VALUES (?,?,?,?,?)';
            const input_data = [user_id, user_name, type, title, inquiry_text];
            const [result1] = await dbcon.query(sql, input_data);

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = "SELECT inquiry_id, user_id, user_name, type, title, CONVERT(inquiry_text USING utf8) as inquiry_text, CONVERT(answer_text USING utf8) as answer_text, date_format(inquiry_date,'%Y-%m-%d') inquiry_date, date_format(answer_date,'%Y-%m-%d') answer_date, state  FROM inquiry WHERE inquiry_id=?";
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

    /** 문의 데이터 수정 --> Update(UPDATE) */
    router.put("/inquiry/:inquiry_id", async (req, res,next) =>{
        const inquiry_id = req.get('inquiry_id');
        const type = req.post('type');
        const title = req.post('title');
        const inquiry_text = req.post('inquiry_text');
        

        try {
            regexHelper.value(inquiry_id, '필수 파라미터가 없습니다.');
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
            const sql = "UPDATE inquiry SET type=?, title=?, inquiry_text=?, answer_date=now() WHERE inquiry_id=?";
            const input_data = [type, title, inquiry_text, inquiry_id];
            const [result1] = await dbcon.query(sql, input_data);

            // 결과 행 수가 0이라면 예외처리
            if (result1.affectedRows < 1) {
                throw new Error('수정된 데이터가 없습니다.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = "SELECT inquiry_id, user_id, user_name, type, title, CONVERT(inquiry_text USING utf8) as inquiry_text, CONVERT(answer_text USING utf8) as answer_text, date_format(inquiry_date,'%Y-%m-%d') inquiry_date, date_format(answer_date,'%Y-%m-%d') answer_date, state  FROM inquiry WHERE inquiry_id=?";
            const [result2] = await dbcon.query(sql2, [inquiry_id]);

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

    /** 문의 데이터 수정(답변) --> Update(UPDATE) */
    router.put("/inquiry_answer/:inquiry_id", async (req, res,next) =>{
        const inquiry_id = req.get('inquiry_id');
        const type = req.post('type');
        const title = req.post('title');
        const inquiry_text = req.post('inquiry_text');
        const answer_text = req.post('answer_text');
        

        try {
            regexHelper.value(inquiry_id, '필수 파라미터가 없습니다.');
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
            const sql = "UPDATE inquiry SET type=?, title=?, inquiry_text=?, answer_text=?, answer_date=now(), state='Y' WHERE inquiry_id=?";
            const input_data = [type, title, inquiry_text, answer_text, inquiry_id];
            const [result1] = await dbcon.query(sql, input_data);

            // 결과 행 수가 0이라면 예외처리
            if (result1.affectedRows < 1) {
                throw new Error('수정된 데이터가 없습니다.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = "SELECT inquiry_id, user_id, user_name, type, title, CONVERT(inquiry_text USING utf8) as inquiry_text, CONVERT(answer_text USING utf8) as answer_text, date_format(inquiry_date,'%Y-%m-%d') inquiry_date, date_format(answer_date,'%Y-%m-%d') answer_date, state  FROM inquiry WHERE inquiry_id=?";
            const [result2] = await dbcon.query(sql2, [inquiry_id]);

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

    /** 답변상태 수정 --> Update(UPDATE) */
    router.put("/inquiry_state/:inquiry_id", async (req, res,next) =>{
        const inquiry_id = req.get('inquiry_id');
        const state = req.post('state');
        console.log(state);
        

        try {
            regexHelper.value(inquiry_id, '필수 파라미터가 없습니다.');
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
            const sql = "UPDATE inquiry SET state=? WHERE inquiry_id=?";
            const input_data = [state, inquiry_id];
            const [result1] = await dbcon.query(sql, input_data);

            // 결과 행 수가 0이라면 예외처리
            if (result1.affectedRows < 1) {
                throw new Error('수정된 데이터가 없습니다.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = "SELECT inquiry_id, user_id, user_name, type, title, CONVERT(inquiry_text USING utf8) as inquiry_text, CONVERT(answer_text USING utf8) as answer_text, date_format(inquiry_date,'%Y-%m-%d') inquiry_date, date_format(answer_date,'%Y-%m-%d') answer_date, state  FROM inquiry WHERE inquiry_id=?";
            const [result2] = await dbcon.query(sql2, [inquiry_id]);

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
    router.delete("/inquiry/:inquiry_id", async (req, res,next) =>{
        const inquiry_id = req.get('inquiry_id');

        try {
            regexHelper.value(inquiry_id, '요청 파라미터가 없습니다.');
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
            // await dbcon.query("DELETE FROM student WHERE inquiry_id=?", [inquiry_id]);
            // 데이터 삭제하기
            const sql = 'DELETE FROM inquiry WHERE inquiry_id=?';
            const [result1] = await dbcon.query(sql, [inquiry_id]);


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
    return router;
}