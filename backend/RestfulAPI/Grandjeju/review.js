/**
 * @filename    : review.js
 * @author      : 양수원 (ysw7939@gmail.com), 한송희 (onee.ssong@gmail.com)
 * @description : review 테이블에 대한 CRUD 기능을 수행하는 Restful API
 */

/** 모듈 참조 부분 */
const config = require('../../helper/_config');
const logger = require('../../helper/LogHelper');
const router = require('express').Router();
const mysql2  = require('mysql2/promise');
const regexHelper = require('../../helper/RegexHelper');
const utilHelper = require('../../helper/UtilHelper');

const fs = require('fs');   

/** 라우팅 정의 부분 */
module.exports = (app) => {
    let dbcon = null;

    /** 전체 목록 조회 --> Read(SELECT) */
    router.get("/review", async(req, res, next) => {

        // 검색어 파라미터 받기 -> 검색어가 없을 경우 전체 목록 조회이므로 유효성검사 안함
        const query = req.get('query');

        // 검색 종류 파라미터 받기 (기본값은 title)
        const search = req.get('search','title');

        // 현재 페이지 번호 받기 (기본값은 1)
        const page = req.get('page', 1);

        // 한 페이지에 보여줄 목록 수 받기 (기본값은 10, 최소 10, 최대 30)
        const rows = req.get('rows', 10);

        const order = req.get('order', 'desc');
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;
        let pagenation = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 전체 데이터 수를 조회
            let sql1 = 'SELECT COUNT(*) AS cnt FROM review';

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
            }



            const [result1] = await dbcon.query(sql1, args1);
            const totalCount = result1[0].cnt;


            // 페이지번호 정보를 계산한다.
            pagenation = utilHelper.pagenation(totalCount, page, rows);
            logger.debug(JSON.stringify(pagenation));
            

            // 데이터 조회
            let sql2 = "SELECT review_id, user_id, user_name, title, CONVERT(text USING utf8) as text, date_format(review_date,'%Y-%m-%d') review_date FROM review"

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
            }
            
            if (order != null) {
                if (order == 'asc'){
                    sql2 += " ORDER BY review_date asc"
                } else if (order == 'desc'){
                    sql2 += " ORDER BY review_date desc"
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
    router.get("/review/:review_id", async(req, res, next) =>{
        const review_id = req.get('review_id');


        try {
            regexHelper.value(review_id, '요청 파라미터가 없습니다.');
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
            const sql = "SELECT review_id, user_id, user_name, title, CONVERT(text USING utf8) as text, date_format(review_date,'%Y-%m-%d') review_date FROM review WHERE review_id=?";
            const [result] = await dbcon.query(sql, [review_id]);

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
    router.get("/reviewdetail/:user_id", async(req, res, next) =>{
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
            let sql = "SELECT review_id, user_id, user_id, user_name, title, CONVERT(text USING utf8) as text, date_format(review_date,'%Y/%m/%d %H:%i') review_date FROM review WHERE user_id=?";
            
            let args = [];

            if (order != null) {
                if (order == 'asc'){
                    sql += " ORDER BY review_date asc"
                } else if (order == 'desc'){
                    sql += " ORDER BY review_date desc"
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

    /** 데이터 추가 --> Create(INSERT) */
    router.post("/review", async(req, res, next) =>{
        // 저장을 위한 파라미터 입력받기
        const user_id = req.post('user_id');
        const user_name = req.post('user_name');
        const title = req.post('title');
        const text = req.post('text');
        const photos = req.post('photos');
        

        try {
            regexHelper.value(user_id, '아이디가 없습니다.');
            regexHelper.maxLength(user_id, 20, '아이디는 최대 20자까지 입력 가능합니다.');
            regexHelper.minLength(user_id, 6, '아이디는 최소 6자 이상 입력 가능합니다.');
            regexHelper.engNum(user_id, '아이디는 영문, 숫자 조합만 입력 가능합니다.');

            regexHelper.value(user_name, '작성자 이름이 없습니다.');
            regexHelper.maxLength(user_name, 20, '이름은 최대 20자까지 입력 가능합니다.');
            regexHelper.minLength(user_name, 2, '이름은 최소 2자 이상 입력 가능합니다.');

            regexHelper.value(title, '리뷰제목이 없습니다.');
            regexHelper.maxLength(title, 255, '리뷰제목은 최대 255자까지 입력 가능합니다.');

            regexHelper.value(text, '리뷰내용이 없습니다.');
            regexHelper.editor_value(text, '리뷰내용이 없습니다.')
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
            const sql1 = 'INSERT INTO review (user_id, user_name, title, text) VALUES (?,?,?,?)';
            const input_data = [user_id, user_name, title, text];
            const [result1] = await dbcon.query(sql1, input_data);

            if (photos != null) {
                photos.forEach(async(v, i) => {
                    // 데이터 수정하기
                    const sql_p = 'UPDATE photo SET review_id=? WHERE photo_id=?';
                    const input_data = [result1.insertId, v];
                    const [result_p] = await dbcon.query(sql_p, input_data);
                })
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = "SELECT review_id, user_id, user_name, title, CONVERT(text USING utf8) as text, date_format(review_date,'%Y/%m/%d %H:%i') review_date FROM review WHERE review_id=?";
            const [result2] = await dbcon.query(sql2, [result1.insertId]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result2
            
            console.log(json)

        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    /** 데이터 수정 --> Update(UPDATE) */
    router.put("/review/:review_id", async (req, res,next) =>{
        const review_id = req.get('review_id');
        const title = req.post('title');
        const text = req.post('text');
        const photos = req.post('photos');

        try {
            regexHelper.value(title, '리뷰제목이 없습니다.');
            regexHelper.maxLength(title, 255, '리뷰제목은 최대 255자까지 입력 가능합니다.');

            regexHelper.value(text, '리뷰내용이 없습니다.');
            regexHelper.editor_value(text, '리뷰내용이 없습니다.')
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
            const sql = 'UPDATE review SET title=?, text=? WHERE review_id=?';
            const input_data = [ title, text, review_id];
            const [result1] = await dbcon.query(sql, input_data);

            if (photos != null) {
                photos.forEach(async(v, i) => {
                    // 데이터 수정하기
                    const sql_p = 'UPDATE photo SET review_id=? WHERE photo_id=?';
                    const input_data = [review_id, v];
                    const [result_p] = await dbcon.query(sql_p, input_data);
                })
            }

            // 결과 행 수가 0이라면 예외처리
            if (result1.affectedRows < 1) {
                throw new Error('수정된 데이터가 없습니다.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = "SELECT review_id, user_id, user_name, title, CONVERT(text USING utf8) as text, date_format(review_date,'%Y/%m/%d %H:%i') review_date FROM review WHERE review_id=?";
            const [result2] = await dbcon.query(sql2, [review_id]);

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
    router.delete("/review/:review_id", async (req, res,next) =>{
        const review_id = req.get('review_id');

        try {
            regexHelper.value(review_id, '요청 파라미터가 없습니다.');
        } catch (err) {
            return next(err);
        }
        
        /** 데이터 삭제하기 */
        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 참조 포토데이터 조회
            const sql = 'SELECT photo_id,  CONVERT(path USING utf8) as path FROM photo WHERE review_id=?';
            const [result] = await dbcon.query(sql, [review_id])
            console.log(result);

            // 참조 파일 삭제
            result.forEach((v, i) => {
                fs.unlinkSync(`../_files${v.path}`);
            })
            
            // 참조 포토테이블 삭제
            await dbcon.query("DELETE FROM photo WHERE review_id=?", [review_id])

            // 데이터 삭제하기
            const sql1 = 'DELETE FROM review WHERE review_id=?';
            const [result1] = await dbcon.query(sql1, [review_id]);


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