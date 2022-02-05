

/** 모듈 참조 부분 */
const config = require('../../helper/_config');
const logger = require('../../helper/LogHelper');
const regexHelper = require('../../helper/RegexHelper');
const utilHelper = require('../../helper/UtilHelper');

const BadRequestException = require('../../exceptions/BadRequestExeption');

const router = require('express').Router();
const mysql2 = require('mysql2/promise');

/** 라우팅 정의 부분 */
module.exports = (app) => {
    let dbcon = null;

    /** 전체 목록 조회 --> Read(SELECT) */
    router.get("/memberstest", async(req, res, next) => {

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
            let sql2 = "SELECT member_id, user_id, user_pw, user_name, user_phone, is_out, date_format(reg_date,'%Y/%m/%d %H:%i') as reg_date  FROM members"

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

    /**
     * 회원가입
     */
    router.post("/memberstest/join", async (req, res, next) => {
        // 저장을 위한 파라미터 입력 받기
        const user_id = req.post('user_id');
        const user_pw = req.post('user_pw');
        const user_name = req.post('user_name');
        const user_phone = req.post('user_phone');
        const is_out = req.post('is_out');
        const reg_date = req.post('reg_date');

        // not null로 설정된 정보에 대한 입력 값 유효성 검사 및 입력한 내용의 형식 검사
        try {
            regexHelper.value(user_id, '아이디가 없습니다.');
            // regexHelper.maxLength(user_id, 20, '아이디는 최대 20자까지 입력 가능합니다.');
            // regexHelper.minLength(user_id, 4, '아이디는 최소 4자 이상 입력 가능합니다.');
            // regexHelper.engNum(user_id, '아이디는 영어와 숫자 조합만 입력 가능합니다.');

            regexHelper.value(user_pw, '비밀번호가 없습니다.');
            // regexHelper.maxLength(user_pw, 30, '비밀번호는 최대 30자까지 입력 가능합니다.');
            // regexHelper.minLength(user_pw, 4, '비밀번호는 최소 4자 이상 입력 가능합니다.');
            // regexHelper.engNum(user_pw, '비밀번호는 영어와 숫자 조합만 입력 가능합니다.');

            regexHelper.value(user_name, '이름이 없습니다.');
            // regexHelper.maxLength(user_name, 20, '이름은 최대 20자까지 입력 가능합니다.');
            // regexHelper.minLength(user_name, 2, '이름은 최소 2자 이상 입력 가능합니다.');
            // regexHelper.kor(user_name, '이름은 한글만 입력 가능합니다.');

            regexHelper.value(user_phone, '연락처를 입력하세요.');
            // regexHelper.phone(user_phone, '연락처가 잘못되었습니다.');
        } catch (err) {
            return next(err);
        }

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 전체 데이터 수를 조회 (중복 검사)
            let sql1 = 'SELECT COUNT(*) AS cnt FROM members WHERE user_id=?';
            let args1 = [user_id, sql1];

            const [result1] = await dbcon.query(sql1, args1);
            const totalCount = result1[0].cnt;

            if (totalCount > 0) {
                throw new BadRequestException('이미 사용 중인 아이디입니다.');
            }

            // 전송받은 모든 정보를 회원 테이블에 저장 (INSERT)
            let sql = "INSERT INTO members (user_id, user_pw, user_name, user_phone, is_out, reg_date) VALUES (?,?,?,?,'N',now())";

            const args = [user_id, user_pw, user_name, user_phone, is_out, reg_date];

            await dbcon.query(sql, args);
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 처리 성공 시에 대한 응답 처리
        res.sendJson();
    });

    /**
     * 로그인
     */
     router.post("/memberstest/login", async (req, res, next) => {
        // 저장을 위한 파라미터 입력 받기
        const user_id = req.post('user_id');
        console.log(user_id);
        const user_pw = req.post('user_pw');
        console.log(user_pw);

        try {
            // 아이디와 비밀번호를 유추하는데 힌트가 될 수 있으므로 유효성 검사는 입력 여부만 확인
            regexHelper.value(user_id, '아이디를 입력하세요.');
            regexHelper.value(user_pw, '비밀번호를 입력하세요.');
        } catch (err) {
            return next(err);
        }

        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();

            // 아이디와 비밀번호가 일치하는 데이터를 조회 (조회 결과에서 비밀번호는 제외)
            let sql1 = 'SELECT member_id, user_id, user_pw, user_name, user_phone, is_out, reg_date FROM members WHERE user_id=? AND user_pw=?';
            let args1 = [user_id, user_pw];

            const [result1] = await dbcon.query(sql1, args1);

            // 조회된 회원 정보 객체를 저장하고 있는 1차원 배열 (원소는 1개)
            json = result1;
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }

        // 조회된 데이터가 없다면? WHERE절이 맞지 않는다는 의미
        // => 아이디 비밀번호가 틀림
        if (json == null || json.length == 0) {
            return next(new BadRequestException('아이디나 비밀번호가 잘못되었습니다.'));
        }

        // 탈퇴한 회원은 로그인 금지
        if (json[0].is_out == 'Y') {
            return next(new BadRequestException('탈퇴한 회원입니다.'));
        }

        // 조회 결과를 세션에 저장
        req.session.memberInfo = json[0];

        res.sendJson();
    });

    /**
     * 로그아웃
     */
     router.delete("/memberstest/logout", async (req, res, next) => {
        if (!req.session.memberInfo) {
            return next(new BadRequestException('로그인 상태가 아닙니다.'));
        }

        try {
            await req.session.destroy();
        } catch (err) {
            return next(err);
        }

        res.sendJson();
    });

    return router;
}