const express = require("express");
const router = express.Router();
let con = require("../database");
const middleware = require("../middleware");
const common = require("../common");
const functions = require("../functions");
// const localISOTime = functions.dateAsiaThai();
async function runQuery(sql, param) {
  return new Promise((resolve, reject) => {
    // setTimeout(() => {
    //   resolve(con.query(sql, param));
    // }, 1000);
    resolve(con.query(sql, param));
  });
}

router.post("/main/create", middleware, (req, res, next) => {
  const data = req.body;
  const user_id = data.user_id;
  const obj = common.drivinglicense_type;
  const result_filter = obj.filter(function (e) {
    return e.dlt_code === data.dlt_code;
  });
  con.query(
    "SELECT user_id FROM app_user WHERE user_id = ?",
    [user_id],
    (err, rows) => {
      let checkuser = rows.length;
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Username Error", // error.sqlMessage
        });
      }
      if (result_filter.length <= 0) {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'drivinglicense_type' ",
        });
      }
      con.query(
        "INSERT INTO app_exam_main (em_code,em_name,em_cover,em_description,em_random_amount,em_time,em_measure,dlt_code,crt_date,udp_date,user_crt,user_udp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          data.em_code,
          data.em_name,
          data.em_cover,
          data.em_description,
          data.em_random_amount,
          data.em_time,
          data.em_measure,
          data.dlt_code,
          functions.dateAsiaThai(),
          functions.dateAsiaThai(),
          user_id,
          user_id,
        ],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.put("/main/update/:em_id", middleware, (req, res, next) => {
  const { em_id } = req.params;
  const data = req.body;
  const user_id = data.user_id;
  const obj = common.drivinglicense_type;
  const result_filter = obj.filter(function (e) {
    return e.dlt_code === data.dlt_code;
  });
  con.query(
    "SELECT user_id FROM app_user WHERE user_id = ?",
    [user_id],
    (err, rows) => {
      let checkuser = rows.length;
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Username Error", // error.sqlMessage
        });
      }
      if (result_filter.length <= 0) {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'drivinglicense_type' ",
        });
      }
      con.query(
        "UPDATE  app_exam_main SET em_code=? , em_name=? ,em_cover=? ,em_description=?,em_random_amount=?,em_time=?,em_measure=?,dlt_code=?,udp_date=?,user_udp=? WHERE em_id=? ",
        [
          data.em_code,
          data.em_name,
          data.em_cover,
          data.em_description,
          data.em_random_amount,
          data.em_time,
          data.em_measure,
          data.dlt_code,
          functions.dateAsiaThai(),
          user_id,
          em_id,
        ],
        function (err, result) {
          if (err) throw err;

          return res.json(result);
        }
      );
    }
  );
});

router.post("/main/list", middleware, async (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = functions.setZero((current_page - 1) * per_page);
  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let sql = `SELECT app_exam_main.em_id,app_exam_main.em_code,app_exam_main.em_name,app_exam_main.em_cover,app_exam_main.em_description,app_exam_main.em_random_amount,app_exam_main.em_time,app_exam_main.em_measure,app_exam_main.dlt_code,app_exam_main.crt_date,app_exam_main.udp_date ,
     CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update, COUNT(q.eq_id) AS total_question
     FROM app_exam_main 
     LEFT JOIN  app_user u1 ON u1.user_id = app_exam_main.user_crt  
     LEFT JOIN  app_user u2 ON u2.user_id = app_exam_main.user_udp 
     LEFT JOIN  app_exam_question q ON q.em_id = app_exam_main.em_id  AND  q.cancelled = 1
     WHERE app_exam_main.cancelled=1`;
  let group = " GROUP BY  app_exam_main.em_id ";
  let order = ` ORDER BY app_exam_main.em_id DESC LIMIT ${offset},${per_page} `;
  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_exam_main WHERE app_exam_main.cancelled=1 ";

  let getCountAll = await runQuery(sql_count);
  total = getCountAll[0] !== undefined ? getCountAll[0]?.numRows : 0;

  if (search !== "" || search.length > 0) {
    let q = ` AND (app_exam_main.em_code  LIKE ? OR app_exam_main.em_name  LIKE  ? OR app_exam_main.em_description  LIKE  ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  let getCountFilter = await runQuery(sql_count, search_param);
  total_filter =
    getCountFilter[0] !== undefined ? getCountFilter[0]?.numRows : 0;

  // query ข้อมูล
  let getContent = await runQuery(sql + group + order, search_param);
  const response = {
    total: total, // จำนวนรายการทั้งหมด
    total_filter: total_filter, // จำนวนรายการทั้งหมด
    current_page: current_page, // หน้าที่กำลังแสดงอยู่
    limit_page: per_page, // limit data
    total_page: Math.ceil(total_filter / per_page), // จำนวนหน้าทั้งหมด
    search: search, // คำค้นหา
    data: getContent, // รายการข้อมูล
  };
  return res.json(response);
});

router.delete("/main/delete/:em_id", middleware, (req, res, next) => {
  const { em_id } = req.params;
  con.query(
    "SELECT em_id FROM app_exam_main WHERE em_id = ?",
    [em_id],
    (err, rows) => {
      let _content = rows.length;

      if (_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }

      con.query(
        "UPDATE  app_exam_main SET cancelled=0 WHERE em_id=? ",
        [em_id],
        function (err, result) {
          if (err) throw err;
          // console.log("1 record inserted");
          return res.json(result);
        }
      );
    }
  );
});

router.post("/question/create", middleware, (req, res, next) => {
  const data = req.body;
  const em_id = data.em_id;
  con.query(
    "SELECT em_id FROM app_exam_main WHERE em_id = ?",
    [em_id],
    (err, rows) => {
      let checkuser = rows.length;
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }
      con.query(
        "INSERT INTO app_exam_question (eq_name,eq_image,eq_answer,em_id) VALUES (?,?,?,?)",
        [data.eq_name, data.eq_image, data.eq_answer, em_id],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.put("/question/update/:eq_id", middleware, (req, res, next) => {
  const data = req.body;
  const { eq_id } = req.params;
  const em_id = data.em_id;

  con.query(
    "SELECT em_id FROM app_exam_main WHERE em_id = ?",
    [em_id],
    (err, rows) => {
      let checkuser = rows.length;
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }
      con.query(
        "UPDATE  app_exam_question SET eq_name=? , eq_image=?,eq_answer=?, em_id=? WHERE eq_id=? ",
        [data.eq_name, data.eq_image, data.eq_answer, data.em_id, eq_id],
        function (err, result) {
          if (err) throw err;

          return res.json(result);
        }
      );
    }
  );
});

router.post("/question/:em_id/list", middleware, async (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const { em_id } = req.params;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = functions.setZero((current_page - 1) * per_page);
  let search_param = [];
  let sql = `SELECT
	t1.eq_id, 
	t1.eq_name, 
	t1.eq_image, 
	t1.eq_answer, 
	t1.em_id
FROM
	app_exam_question t1
	WHERE
  t1.em_id =? AND
	t1.cancelled =1
  `;
  let param1 = [em_id];

  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_exam_question t1 WHERE t1.em_id=? AND t1.cancelled=1 ";

  const getCountAll = await runQuery(sql_count, param1);
  const total = getCountAll[0] !== undefined ? getCountAll[0]?.numRows : 0;

  if (search !== "" || search.length > 0) {
    let q = ` AND (t1.eq_name  LIKE ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`];
  }

  const getCountFilter = await runQuery(sql_count, param1.concat(search_param));
  const total_filter =
    getCountFilter[0] !== undefined ? getCountFilter[0]?.numRows : 0;

  sql += `  ORDER BY t1.eq_id DESC LIMIT ${offset},${per_page} `;

  // query ข้อมูล
  let getQuestion = await runQuery(sql, param1.concat(search_param));
  let obj = [];
  for (let i = 0; i < getQuestion.length; i++) {
    let el = getQuestion[i];
    // console.log(el);
    // let choices = JSON.parse(el?.choices);
    let choices = await runQuery(
      "SELECT * FROM `app_exam_choice` WHERE eq_id = ? AND cancelled =1",
      [el?.eq_id]
    );
    let newObj = {
      eq_id: el?.eq_id,
      eq_name: el?.eq_name,
      eq_image: el?.eq_image,
      eq_answer: el?.eq_answer,
      em_id: em_id,
      choices: choices,
    };
    obj.push(newObj);
  }

  const response = {
    total: total, // จำนวนรายการทั้งหมด
    total_filter: total_filter, // จำนวนรายการที่ค้นหา
    current_page: current_page, // หน้าที่กำลังแสดงอยู่
    limit_page: per_page, // limit data
    total_page: Math.ceil(total_filter / per_page), // จำนวนหน้าทั้งหมด
    search: search, // คำค้นหา
    data: obj, // รายการข้อมูล
  };
  return res.json(response);
});

router.delete("/question/delete/:eq_id", middleware, (req, res, next) => {
  const { eq_id } = req.params;
  con.query(
    "SELECT eq_id FROM app_exam_question WHERE eq_id = ?",
    [eq_id],
    (err, rows) => {
      let _content = rows.length;

      if (_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }

      con.query(
        "UPDATE  app_exam_question SET cancelled=0 WHERE eq_id=? ",
        [eq_id],
        function (err, result) {
          if (err) throw err;
          // console.log("1 record inserted");
          return res.json(result);
        }
      );
    }
  );
});

router.post("/choice/create", middleware, (req, res, next) => {
  const data = req.body;
  const eq_id = data.eq_id;
  const ec_index = data.ec_index;
  //   const em_id = data.em_id;
  let em_id;
  con.query(
    "SELECT em_id FROM app_exam_question WHERE eq_id = ? AND cancelled=1 ",
    [eq_id],
    (err, rows) => {
      if (err) throw err;
      let checkuser = rows.length;
      let question = rows[0];
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }
      em_id = question?.em_id;

      con.query(
        "SELECT ec_index FROM app_exam_choice WHERE eq_id = ? AND ec_index=? AND cancelled=1",
        [eq_id, ec_index],
        (err, rows) => {
          if (err) throw err;
          let _check_data = rows.length;

          if (_check_data > 0) {
            return res.status(400).json({
              status: 400,
              message: "Error Transaction",
            });
          }
          con.query(
            "INSERT INTO app_exam_choice (ec_index,ec_name,ec_image,eq_id,em_id) VALUES (?,?,?,?,?)",
            [ec_index, data.ec_name, data.ec_image, eq_id, em_id],
            function (err, result) {
              if (err) throw err;
              return res.json(result);
            }
          );
        }
      );
    }
  );
});

router.put("/choice/update/:ec_id", middleware, (req, res, next) => {
  const { ec_id } = req.params;
  const data = req.body;
  const eq_id = data.eq_id;
  const ec_index = data.ec_index;
  //   const em_id = data.em_id;
  let em_id;
  con.query(
    "SELECT em_id FROM app_exam_question WHERE eq_id = ? ",
    [eq_id],
    (err, rows) => {
      let checkuser = rows.length;
      let question = rows[0];
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }
      em_id = question?.em_id;

      con.query(
        "SELECT ec_index FROM app_exam_choice WHERE eq_id = ? AND ec_index=? AND ec_id !=? AND cancelled=1",
        [eq_id, ec_index, ec_id],
        (err, rows) => {
          if (err) throw err;
          let _check_data = rows.length;

          if (_check_data > 0) {
            return res.status(400).json({
              status: 400,
              message: "Error Transaction",
            });
          }
          con.query(
            "UPDATE  app_exam_choice SET ec_index=?,ec_name=?,ec_image=?,eq_id=?,em_id=? WHERE ec_id=? ",
            [ec_index, data.ec_name, data.ec_image, eq_id, em_id, ec_id],
            function (err, result) {
              if (err) throw err;
              return res.json(result);
            }
          );
        }
      );
    }
  );
});

router.get("/choice/list/:eq_id", middleware, (req, res, next) => {
  const { eq_id } = req.params;
  con.query(
    "SELECT ec_id,ec_index,ec_name,ec_image,eq_id,em_id FROM app_exam_choice WHERE eq_id = ? AND  cancelled = 1 ",
    [eq_id],
    function (err, results) {
      return res.json(results);
    }
  );
});

router.delete("/choice/delete/:ec_id", middleware, (req, res, next) => {
  const { ec_id } = req.params;
  con.query(
    "UPDATE  app_exam_choice SET cancelled=0  WHERE ec_id = ?",
    [ec_id],
    function (err, results) {
      return res.json(results);
    }
  );
});

router.post("/start/render", middleware, async (req, res, next) => {
  // const present_day = new Date().getDate();
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const clear_cach = data.clear_cach; // 0 = ไม่เคลียร์ , 1 = เคลียร์
  const em_id = data.em_id;
  const user_id = data.user_id;
  const offset = functions.setZero((current_page - 1) * per_page);
  let exam_complete = 0;
  // --IFNULL(CONCAT('[',(SELECT    GROUP_CONCAT((JSON_OBJECT('ec_id', t2.ec_id,'ec_index', t2.ec_index,'ec_name', t2.ec_name,'ec_image', t2.ec_image,'eq_id', t2.eq_id,'em_id', t2.em_id)))  FROM app_exam_choice t2  WHERE eq_id =  t1.eq_id AND cancelled=1 ) ,']'),'[]') AS choices
  let sql_question = `
  SELECT
  t0.ec_score,
  t0.is_complete,
  t0.ec_id,
  t1.eq_id, 
  t1.eq_name, 
  t1.eq_image, 
  t1.eq_answer, 
  t1.em_id
FROM
  app_exam_cache t0
  INNER JOIN  app_exam_question t1 ON t1.eq_id = t0.eq_id  AND  t1.cancelled = 1
  INNER JOIN  app_user t2 ON t2.user_id = t0.user_id 
  WHERE
  t0.em_id =?  AND
  t0.user_id =?
  ORDER BY t0.id ASC
  LIMIT  ${offset},${per_page}
  `;

  // ลบแคชของวันที่ผ่านมาออก
  // console.log(new Date().getDate());
  const count_cache_yesterday = await runQuery(
    "SELECT COUNT(*) AS total_cache   FROM app_exam_cache WHERE DAY(udp_date) < ? ",
    [new Date().getDate()]
  );
  const total_cache_yesterday =
    count_cache_yesterday[0]?.total_cache !== undefined
      ? count_cache_yesterday[0]?.total_cache
      : 0;
  if (total_cache_yesterday > 0) {
    await runQuery("TRUNCATE TABLE app_exam_cache", []);
    await runQuery("TRUNCATE TABLE app_exam_time", []);
  }

  if (clear_cach === 1) {
    await runQuery(
      "DELETE FROM app_exam_cache WHERE em_id = ? AND user_id =?",
      [em_id, user_id]
    );
  }
  // จำนวน Cache
  const count_cache = await runQuery(
    "SELECT COUNT(*) AS total_cache FROM app_exam_cache WHERE em_id = ? AND user_id =? ",
    [em_id, user_id]
  );
  const total_cache =
    count_cache[0]?.total_cache !== undefined ? count_cache[0]?.total_cache : 0;

  // จำนวน Cache ข้อสอบที่ทำเสร็จ
  const count_cache_complete = await runQuery(
    "SELECT COUNT(*) AS total_cache_complete FROM app_exam_cache WHERE em_id = ? AND user_id =? AND is_complete=1",
    [em_id, user_id]
  );
  //จำนวนข้อสอบที่ทำแล้วทั้งหมด
  const total_cache_complete =
    count_cache_complete[0]?.total_cache_complete !== undefined
      ? count_cache_complete[0]?.total_cache_complete
      : 0;

  // ดึงข้อมูลจำนวนการ Random จากฐานข้อมูลหลักสูตร
  const random_amount = await runQuery(
    "SELECT em_random_amount FROM app_exam_main WHERE em_id = ?",
    [em_id]
  );
  const em_random_amount =
    random_amount[0]?.em_random_amount !== undefined
      ? random_amount[0]?.em_random_amount
      : 0;

  // ถ้าจำนวนการ Random เท่ากับ 0 ให้หยุดการทำงาน
  if (em_random_amount <= 0) {
    return res.status(400).json({
      status: 400,
      message: "Error Transaction",
    });
  }

  // ตรวจสอบว่าทำข้อสอบเสร้จหมดทุกข้อยัง
  if (
    total_cache_complete >= total_cache &&
    clear_cach !== 1 &&
    total_cache !== 0
  ) {
    exam_complete = 1;
  }
  // console.log(functions.dateAsiaThai());
  if (total_cache < 1) {
    await runQuery(
      `INSERT INTO app_exam_cache (ec_id,eq_id,em_id,user_id,udp_date) 
      SELECT 
      IF(em_id >=1,'0','0') AS c1 ,
      eq_id,
      em_id,
      IF(em_id >=1,'${user_id}','0'), 
      IF(em_id >=1,'${functions.dateAsiaThai()}','${functions.dateAsiaThai()}')
      FROM app_exam_question WHERE cancelled = 1 AND em_id = ?  ORDER BY RAND() LIMIT ?`,
      [em_id, em_random_amount]
    );
  }

  const getQuestion = await runQuery(sql_question, [em_id, user_id]);
  let obj = [];
  // console.log(getQuestion);
  for (let i = 0; i < getQuestion.length; i++) {
    let el = getQuestion[i];
    // console.log(el);
    // let choices = JSON.parse(el?.choices);
    let choices = await runQuery(
      "SELECT * FROM `app_exam_choice` WHERE eq_id = ? AND cancelled =1",
      [el?.eq_id]
    );
    let newObj = {
      user_id: user_id,
      ec_score: el?.ec_score,
      is_complete: el?.is_complete,
      eq_id: el?.eq_id,
      eq_name: el?.eq_name,
      eq_image: el?.eq_image,
      eq_answer: el?.eq_answer,
      em_id: em_id,
      ec_id: el?.ec_id,
      choices: choices,
    };
    obj.push(newObj);
  }
  // จำนวน Cache
  const count_cache_repeat = await runQuery(
    "SELECT COUNT(*) AS total_cache FROM app_exam_cache WHERE em_id = ? AND user_id =? ",
    [em_id, user_id]
  );
  let repeat =
    count_cache_repeat[0]?.total_cache !== undefined
      ? count_cache_repeat[0]?.total_cache
      : 0;
  const response = {
    total: repeat, // จำนวนรายการทั้งหมด
    current_page: current_page, // หน้าที่กำลังแสดงอยู่
    limit_page: per_page, // limit data
    total_page: Math.ceil(repeat / per_page), // จำนวนหน้าทั้งหมด
    exam_complete: exam_complete, ///สถานะการทำข้อสอบเสร็จต่อรอบ
    data: obj, // รายการข้อมูล
  };
  return res.json(response);
});

router.post("/send/render", middleware, async (req, res, next) => {
  const data = req.body;
  const ec_id = data.ec_id;
  const user_id = data.user_id;
  let score = 0;
  // เช็คคำตอบที่ถุกกำหนดในคำถาม
  let chkQuestion = await runQuery(
    " SELECT * FROM app_exam_choice WHERE ec_id = ?",
    [ec_id]
  );
  let eq_id = chkQuestion[0]?.eq_id !== undefined ? chkQuestion[0]?.eq_id : 0;
  let em_id = chkQuestion[0]?.em_id !== undefined ? chkQuestion[0]?.em_id : 0;
  let ec_index =
    chkQuestion[0]?.ec_index !== undefined ? chkQuestion[0]?.ec_index : 0;

  let chkAnswer = await runQuery(
    "SELECT eq_answer FROM app_exam_question WHERE eq_id = ?",
    [eq_id]
  );
  let eq_answer =
    chkAnswer[0]?.eq_answer !== undefined ? chkAnswer[0]?.eq_answer : 0;
  if (eq_answer === ec_index) {
    score = 1;
  }
  let result = await runQuery(
    "UPDATE  app_exam_cache SET ec_score=?,is_complete=?,ec_id=? WHERE eq_id=? AND em_id=?  AND user_id=? ",
    [score, 1, ec_id, eq_id, em_id, user_id]
  );
  return res.json(result);
});

router.post("/result/render", middleware, (req, res, next) => {
  const data = req.body;
  const em_id = data.em_id;
  const user_id = data.user_id;

  // เช็คคำตอบที่ถุกกำหนดในคำถาม
  con.query(
    " SELECT SUM(ec_score) AS sum_score, COUNT(*) AS total_question FROM app_exam_cache WHERE em_id	 = ? AND  user_id=? GROUP BY user_id",
    [em_id, user_id],
    (err, rs) => {
      // if (err) throw err;
      let _check_data = rs.length;
      if (_check_data <= 0) {
        return res.status(400).json({
          status: 400,
          message: "Error Transaction",
        });
      }
      // console.log(rs);
      let sum_score = rs[0]?.sum_score !== undefined ? rs[0]?.sum_score : 0;
      let total_question =
        rs[0]?.total_question !== undefined ? rs[0]?.total_question : 0;
      // นำคำตอบที่เลือกมาตรวจสอบกับหมายเลขในคำถามว่าตรงกันหรือไม่
      con.query(
        "INSERT INTO app_exam_result (er_score_total,er_question_total,crt_date,udp_date,user_id,em_id) VALUES (?,?,?,?,?,?)",
        [
          sum_score,
          total_question,
          functions.dateAsiaThai(),
          functions.dateAsiaThai(),
          user_id,
          em_id,
        ],
        (err, rs_end) => {
          // Update ข้อสอบที่กำลังทำทั้งหมดเป็น ทำครบแล้ว
          con.query(
            "UPDATE  app_exam_cache SET is_complete = 1 WHERE em_id=?  AND user_id=? ",
            [em_id, user_id],
            function (err, result) {
              // if (err) throw err;
              return res.json(result);
            }
          );
        }
      );
    }
  );
});

router.post("/time/render", middleware, (req, res, next) => {
  const data = req.body;
  const em_id = data.em_id;
  const user_id = data.user_id;
  const et_time = data.et_time;
  con.query(
    " SELECT * FROM app_exam_time WHERE em_id = ? AND user_id=?",
    [em_id, user_id],
    (err, rs_time) => {
      if (err) throw err;
      let _check_data = rs_time.length;
      if (_check_data <= 0) {
        con.query(
          "INSERT INTO app_exam_time (et_time,em_id,user_id,udp_date) VALUES (?,?,?,?)",
          [et_time, em_id, user_id, functions.dateAsiaThai()],
          (err, rs) => {
            return res.json(rs);
          }
        );
      } else {
        con.query(
          "UPDATE  app_exam_time SET et_time=? ,  udp_date=? WHERE em_id=?  AND user_id=? ",
          [et_time, functions.dateAsiaThai(), em_id, user_id],
          (err, rs) => {
            return res.json(rs);
          }
        );
      }
    }
  );
});
router.get("/time?", middleware, (req, res, next) => {
  const em_id = req.query.em_id;
  const user_id = req.query.user_id;
  con.query(
    " SELECT * FROM app_exam_time WHERE em_id = ? AND user_id = ?",
    [em_id, user_id],
    (err, rs) => {
      return res.json(rs[0]);
    }
  );
});

router.get("/history?", middleware, (req, res, next) => {
  const em_id = req.query.em_id;
  const user_id = req.query.user_id;
  let sql = `
  SELECT
  t1.*,
  (SELECT   GROUP_CONCAT((JSON_OBJECT('user_id', t2.user_id,'user_firstname', t2.user_firstname,'user_lastname', t2.user_lastname , 'user_email', t2.user_email,'user_phone', t2.user_phone)))  FROM app_user t2 WHERE t2.user_id =  t1.user_id) AS out_user,
  (SELECT   GROUP_CONCAT((JSON_OBJECT('em_code', t3.em_code,'em_name', t3.em_name , 'em_cover', t3.em_cover, 'em_description', t3.em_description, 'em_random_amount', t3.em_random_amount , 'em_time', t3.em_time ,'em_measure',t3.em_measure, 'dlt_code', t3.dlt_code)))  FROM app_exam_main t3 WHERE t3.em_id =  t1.em_id) AS out_em
  FROM app_exam_result t1 WHERE t1.em_id = ? AND t1.user_id = ? ORDER BY t1.er_id DESC 
  `;
  con.query(sql, [em_id, user_id], (err, rs) => {
    let obj = [];
    rs.forEach((el) => {
      // console.log(JSON.parse(el?.choices));
      const out_user = JSON.parse(el?.out_user);
      const out_em = JSON.parse(el?.out_em);
      let em_measure = out_em?.em_measure;
      let result = "fail";
      // เปรียบเทียบว่าคะแนนที่ได้ผ่านเกณฑ์หรือไม่
      if (parseInt(el?.er_score_total) >= parseInt(em_measure)) {
        result = "pass";
      }
      // console.log(em_measure);
      let newObj = {
        er_id: el?.er_id,
        er_score_total: el?.er_score_total,
        er_question_total: el?.er_question_total,
        crt_date: el?.crt_date,
        udp_date: el?.udp_date,
        user_id: el?.user_id,
        em_id: el?.em_id,
        status: result,
        out_user: out_user,
        out_em: out_em,
      };
      obj.push(newObj);
    });
    return res.json(obj);
  });
});

router.post("/history/:em_id", middleware, (req, res, next) => {
  const { em_id } = req.params;
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = functions.setZero((current_page - 1) * per_page);
  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let param = [em_id];
  let sql = `
  SELECT
  t1.*,
  (SELECT   GROUP_CONCAT((JSON_OBJECT('user_id', t2.user_id,'user_firstname', t2.user_firstname,'user_lastname', t2.user_lastname , 'user_email', t2.user_email,'user_phone', t2.user_phone)))  FROM app_user t2 WHERE t2.user_id =  t1.user_id) AS out_user,
  (SELECT   GROUP_CONCAT((JSON_OBJECT('em_code', t3.em_code,'em_name', t3.em_name , 'em_cover', t3.em_cover, 'em_description', t3.em_description, 'em_random_amount', t3.em_random_amount , 'em_time', t3.em_time , 'dlt_code', t3.dlt_code)))  FROM app_exam_main t3 WHERE t3.em_id =  t1.em_id) AS out_em
  FROM app_exam_result t1 
  INNER JOIN app_user t4 ON t4.user_id = t1.user_id
  WHERE t1.em_id = ?
  `;
  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_exam_result  t1 INNER JOIN app_user t4 ON t4.user_id = t1.user_id WHERE  t1.em_id=?  ";

  con.query(sql_count, [em_id], (err, results) => {
    let res = results[0];
    total = res !== undefined ? res?.numRows : 0;
  });
  if (search !== "" || search.length > 0) {
    let q = ` AND (t4.user_firstname  LIKE ? OR t4.user_lastname  LIKE  ?)`; //
    sql += q;
    sql_count += q;

    search_param = [`%${search}%`, `%${search}%`];
  }

  con.query(sql_count, param.concat(search_param), (err, rows) => {
    let res = rows[0];
    total_filter = res !== undefined ? res?.numRows : 0;
  });
  sql += `  ORDER BY t1.er_id DESC LIMIT ${offset},${per_page} `;

  con.query(sql, param.concat(search_param), (err, rs) => {
    let obj = [];
    rs.forEach((el) => {
      const out_user = JSON.parse(el?.out_user);
      const out_em = JSON.parse(el?.out_em);
      let em_measure = out_em?.em_measure;
      let result = "fail";
      // เปรียบเทียบว่าคะแนนที่ได้ผ่านเกณฑ์หรือไม่
      if (parseInt(el?.er_score_total) >= parseInt(em_measure)) {
        result = "pass";
      }
      let newObj = {
        er_id: el?.er_id,
        er_score_total: el?.er_score_total,
        er_question_total: el?.er_question_total,
        crt_date: el?.crt_date,
        udp_date: el?.udp_date,
        user_id: el?.user_id,
        em_id: el?.em_id,
        status: result,
        out_user: out_user,
        out_em: out_em,
      };
      obj.push(newObj);
    });
    const response = {
      total: total, // จำนวนรายการทั้งหมด
      total_filter: total_filter, // จำนวนรายการทั้งหมด
      current_page: current_page, // หน้าที่กำลังแสดงอยู่
      limit_page: per_page, // limit data
      total_page: Math.ceil(total_filter / per_page), // จำนวนหน้าทั้งหมด
      search: search, // คำค้นหา
      data: obj, // รายการข้อมูล
    };

    return res.json(response);
  });
});

module.exports = router;
