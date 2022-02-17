const config = require('../../helper/_config');
const logger = require('../../helper/LogHelper');
const router = require('express').Router();
const mysql2  = require('mysql2/promise');
const regexHelper = require('../../helper/RegexHelper');
const utilHelper = require('../../helper/UtilHelper');
const BadRequestException = require('../../exceptions/BadRequestExeption');
const RuntimeException = require('../../exceptions/RuntimeException');
const MultipartException = require('../../exceptions/MultipartException');

module.exports = (app) => {
    router.post("/photo", async(req, res, next) =>{
        // WebHelper에 추가된 기능을 활용하여 업로드 객체 반화받기
        const multipart = req.getMultipart();

        // 업로드 수행하기
        const upload = multipart.single('photo_img');

        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        // 업로드 처리 후 텍스트 파라미터 받기
        upload(req, res, async (err) => {
            // 업로드 에러 처리
            if (err) {
                throw new MultipartException(err);
            }

            // 업로드 된 파일의 정보를 로그로 기록 (필요에 따른 선택 사항)
            logger.debug(JSON.stringify(req.file));

            const photo = req.file.url;

            try {
                // 데이터베이스 접속
                dbcon = await mysql2.createConnection(config.GJ_database);
                await dbcon.connect();


                // 전송받은 모든 정보를 회원 테이블에 저장(INSERT)
                const sql1 = "INSERT INTO `photo` (path) VALUES (?);"

                const args = [ photo ]

                const [result1] =await dbcon.query(sql1, args);

                // 저장된 데이터의 
                            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
                const sql2 = 'SELECT photo_id,  CONVERT(path USING utf8) as path FROM photo WHERE photo_id=?';
                const [result2] = await dbcon.query(sql2, [result1.insertId]);

                json = result2;

            } catch(err) {
                return next(err);
            } finally {
                dbcon.end();
            }

            // 처리 성공시에 대한 응답 처리
            res.sendJson({'item': json});
        });
    });
    router.put("/photo/:photo_id", async (req, res,next) => {
        const photo_id = req.get('photo_id');
        const review_id = req.post('review_id');

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.GJ_database);
            await dbcon.connect();
            // 데이터 수정하기
            const sql = 'UPDATE photo SET review_id=? WHERE photo_id=?';
            const input_data = [review_id, photo_id];
            const [result1] = await dbcon.query(sql, input_data);

            // 결과 행 수가 0이라면 예외처리
            if (result1.affectedRows < 1) {
                throw new Error('수정된 데이터가 없습니다.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = 'SELECT photo_id, review_id,  CONVERT(path USING utf8) as path FROM photo where photo_id=?';
            const [result2] = await dbcon.query(sql2, [photo_id]);

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
return router;
}