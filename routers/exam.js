const express = require("express");
const router = express.Router();
const con = require("../database");
const middleware = require("../middleware");
const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);

router.post("/main/create", middleware, (req, res, next) => {
  const data = req.body;
  const user_id = data.user_id;
  con.query(
    "SELECT user_id FROM app_user WHERE user_id = ? LIMIT 1",
    [user_id],
    (err, rows) => {
      let checkuser = rows.length;
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Username Error", // error.sqlMessage
        });
      }
      con.query(
        "INSERT INTO app_exam_main (em_code,em_name,em_cover,em_description,em_random_amount,em_time,dlt_code,crt_date,udp_date,user_crt,user_udp) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [
          data.em_code,
          data.em_name,
          data.em_cover,
          data.em_description,
          data.em_random_amount,
          data.em_time,
          data.dlt_code,
          localISOTime,
          localISOTime,
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
  con.query(
    "SELECT user_id FROM app_user WHERE user_id = ? LIMIT 1",
    [user_id],
    (err, rows) => {
      let checkuser = rows.length;
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Username Error", // error.sqlMessage
        });
      }
      con.query(
        "UPDATE  app_exam_main SET em_code=? , em_name=? ,em_cover=? ,em_description=?,em_random_amount=?,em_time=?,dlt_code=?,udp_date=?,user_udp=? WHERE em_id=? ",
        [
          data.em_code,
          data.em_name,
          data.em_cover,
          data.em_description,
          data.em_random_amount,
          data.em_time,
          data.dlt_code,
          localISOTime,
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

router.post("/main/list", middleware, (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = (current_page - 1) * per_page;
  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let sql = `SELECT app_exam_main.em_id,app_exam_main.em_code,app_exam_main.em_name,app_exam_main.em_cover,app_exam_main.em_description,app_exam_main.em_random_amount,app_exam_main.em_time,app_exam_main.dlt_code,app_exam_main.crt_date,app_exam_main.udp_date ,
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
  con.query(sql_count, (err, results) => {
    let res = results[0];
    total = res !== undefined ? res?.numRows : 0;
  });

  if (search !== "" || search.length > 0) {
    let q = ` AND (app_exam_main.em_code  LIKE ? OR app_exam_main.em_name  LIKE  ? OR app_exam_main.em_description  LIKE  ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  con.query(sql_count, search_param, (err, rows) => {
    let res = rows[0];
    total_filter = res !== undefined ? res?.numRows : 0;
  });

  // query ข้อมูล
  con.query(sql + group + order, search_param, (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request", // error.sqlMessage
      });
    }

    const response = {
      total: total, // จำนวนรายการทั้งหมด
      total_filter: total_filter, // จำนวนรายการที่ค้นหา
      current_page: current_page, // หน้าที่กำลังแสดงอยู่
      limit_page: per_page, // limit data
      total_page: Math.ceil(total / per_page), // จำนวนหน้าทั้งหมด
      search: search, // คำค้นหา
      data: results, // รายการข้อมูล
    };
    return res.json(response);
  });
});

router.delete("/main/delete/:em_id", middleware, (req, res, next) => {
  const { em_id } = req.params;
  con.query(
    "SELECT em_id FROM app_exam_main WHERE em_id = ? LIMIT 1",
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
    "SELECT em_id FROM app_exam_main WHERE em_id = ? LIMIT 1",
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
    "SELECT em_id FROM app_exam_main WHERE em_id = ? LIMIT 1",
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

router.post("/question/:em_id/list", middleware, (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const { em_id } = req.params;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = (current_page - 1) * per_page;
  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let sql = `SELECT
	t1.eq_id, 
	t1.eq_name, 
	t1.eq_image, 
	t1.eq_answer, 
	t1.em_id,
	IFNULL(CONCAT('[',(SELECT    GROUP_CONCAT((JSON_OBJECT('ec_id', t2.ec_id,'ec_index', t2.ec_index,'ec_name', t2.ec_name,'ec_image', t2.ec_image,'eq_id', t2.eq_id,'em_id', t2.em_id)))  FROM app_exam_choice t2  WHERE eq_id =  t1.eq_id AND cancelled=1 ) ,']'),'[]') AS choices
FROM
	app_exam_question t1
	WHERE
  t1.em_id =? AND
	t1.cancelled =1
  `;
  let param1 = [em_id];

  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_exam_question t1 WHERE t1.em_id=? AND t1.cancelled=1 ";
  con.query(sql_count, param1, (err, results) => {
    // console.log(results);
    let res = results[0];
    total = res !== undefined ? res?.numRows : 0;
  });

  if (search !== "" || search.length > 0) {
    let q = ` AND (t1.eq_name  LIKE ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`];
  }

  con.query(sql_count, param1.concat(search_param), (err, rows) => {
    total_filter = rows.length;
  });

  sql += `  ORDER BY t1.eq_id DESC LIMIT ${offset},${per_page} `;

  // query ข้อมูล
  con.query(sql, param1.concat(search_param), (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request", // error.sqlMessage
      });
    }
    let obj = [];
    results.forEach((el) => {
      // console.log(JSON.parse(el?.choices));
      let eq_id = el?.eq_id;
      let eq_name = el?.eq_name;
      let eq_image = el?.eq_image;
      let eq_answer = el?.eq_answer;
      let em_id = el?.em_id;
      let choices = JSON.parse(el?.choices);
      let newObj = {
        eq_id: eq_id,
        eq_name: eq_name,
        eq_image: eq_image,
        eq_answer: eq_answer,
        em_id: em_id,
        choices: choices,
      };
      obj.push(newObj);
    });

    const response = {
      total: total, // จำนวนรายการทั้งหมด
      total_filter: total_filter, // จำนวนรายการที่ค้นหา
      current_page: current_page, // หน้าที่กำลังแสดงอยู่
      limit_page: per_page, // limit data
      total_page: Math.ceil(total / per_page), // จำนวนหน้าทั้งหมด
      search: search, // คำค้นหา
      data: obj, // รายการข้อมูล
    };
    return res.json(response);
  });
});

router.delete("/question/delete/:eq_id", middleware, (req, res, next) => {
  const { eq_id } = req.params;
  con.query(
    "SELECT eq_id FROM app_exam_question WHERE eq_id = ? LIMIT 1",
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
    "SELECT em_id FROM app_exam_question WHERE eq_id = ? AND cancelled=1 LIMIT 1",
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
    "SELECT em_id FROM app_exam_question WHERE eq_id = ?  LIMIT 1",
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

router.post("/start/render", middleware, (req, res, next) => {
  // const { em_id, user_id } = req.params;
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const clear_cach = data.clear_cach; // 0 = ไม่เคลียร์ , 1 = เคลียร์
  const em_id = data.em_id;
  const user_id = data.user_id;
  const offset = (current_page - 1) * per_page;
  let total_cach = 0;
  let total_cach_complete = 0; //จำนวนข้อสอบที่ทำแล้วทั้งหมด
  let exam_complete = 0;
  let sql_question = `SELECT
  t0.ec_score,
  t0.is_complete,
  t0.ec_id,
  t1.eq_id, 
  t1.eq_name, 
  t1.eq_image, 
  t1.eq_answer, 
  t1.em_id,
  IFNULL(CONCAT('[',(SELECT    GROUP_CONCAT((JSON_OBJECT('ec_id', t2.ec_id,'ec_index', t2.ec_index,'ec_name', t2.ec_name,'ec_image', t2.ec_image,'eq_id', t2.eq_id,'em_id', t2.em_id)))  FROM app_exam_choice t2  WHERE eq_id =  t1.eq_id AND cancelled=1 ) ,']'),'[]') AS choices
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
  if (clear_cach === 1) {
    con.query("DELETE  FROM app_exam_cache WHERE em_id = ? AND user_id =?", [
      em_id,
      user_id,
    ]);
  }

  con.query(
    "SELECT COUNT(*) AS total_cach FROM app_exam_cache WHERE em_id = ? AND user_id =? ",
    [em_id, user_id],
    (err, rows) => {
      total_cach = rows[0]?.total_cach !== undefined ? rows[0]?.total_cach : 0;
    }
  );

  con.query(
    "SELECT COUNT(*) AS total_cach_complete FROM app_exam_cache WHERE em_id = ? AND user_id =? AND is_complete=1",
    [em_id, user_id],
    (err, rows) => {
      total_cach_complete =
        rows[0]?.total_cach_complete !== undefined
          ? rows[0]?.total_cach_complete
          : 0;
    }
  );

  con.query(
    "SELECT em_random_amount FROM app_exam_main WHERE em_id = ?  LIMIT 1",
    [em_id],
    (err, results) => {
      if (err) throw err;
      let _check_data = results.length;

      if (_check_data <= 0) {
        return res.status(400).json({
          status: 400,
          message: "Error Transaction",
        });
      }

      let em_random_amount = results[0]?.em_random_amount;
      // ตรวจสอบว่าทำข้อสอบเสร้จหมดทุกข้อยัง
      if (total_cach_complete >= total_cach && clear_cach !== 1) {
        exam_complete = 1;
      }
      // console.log(total_cach);
      if (total_cach < 1) {
        con.query(
          `INSERT INTO app_exam_cache (ec_id,eq_id,em_id,user_id) SELECT IF(em_id >=1,'0','0') AS c1 ,eq_id,em_id ,IF(em_id >=1,${user_id},'0') AS c2 FROM app_exam_question WHERE em_id = ?  ORDER BY RAND() LIMIT ?`,
          [em_id, em_random_amount]
        );
      }

      con.query(sql_question, [em_id, user_id], function (err, rows_question) {
        let obj = [];
        rows_question.forEach((el) => {
          // console.log(JSON.parse(el?.choices));
          let ec_score = el?.ec_score;
          let is_complete = el?.is_complete;
          let eq_id = el?.eq_id;
          let eq_name = el?.eq_name;
          let eq_image = el?.eq_image;
          let eq_answer = el?.eq_answer;
          let ec_id = el?.ec_id;
          let em_id = el?.em_id;
          let choices = JSON.parse(el?.choices);
          let newObj = {
            user_id: user_id,
            ec_score: ec_score,
            is_complete: is_complete,
            eq_id: eq_id,
            eq_name: eq_name,
            eq_image: eq_image,
            eq_answer: eq_answer,
            em_id: em_id,
            ec_id: ec_id,
            choices: choices,
          };
          obj.push(newObj);
        });
        // console.log(total_cach_complete);
        // console.log(total_cach);
        const response = {
          total: total_cach, // จำนวนรายการทั้งหมด
          current_page: current_page, // หน้าที่กำลังแสดงอยู่
          limit_page: per_page, // limit data
          total_page: Math.ceil(total_cach / per_page), // จำนวนหน้าทั้งหมด
          exam_complete: exam_complete, ///สถานะการทำข้อสอบเสร็จต่อรอบ
          data: obj, // รายการข้อมูล
        };
        return res.json(response);
      });
    }
  );
});

router.post("/send/render", middleware, (req, res, next) => {
  const data = req.body;
  const ec_id = data.ec_id;
  const user_id = data.user_id;

  // เช็คคำตอบที่ถุกกำหนดในคำถาม
  con.query(
    " SELECT * FROM app_exam_choice WHERE ec_id = ? LIMIT 1 ",
    [ec_id],
    (err, rows_choice) => {
      if (err) throw err;
      let eq_id =
        rows_choice[0]?.eq_id !== undefined ? rows_choice[0]?.eq_id : 0;
      let em_id =
        rows_choice[0]?.em_id !== undefined ? rows_choice[0]?.em_id : 0;
      let ec_index = rows_choice[0]?.ec_index;
      let score = 0;

      //นำคำตอบที่เลือกมาตรวจสอบกับหมายเลขในคำถามว่าตรงกันหรือไม่
      con.query(
        "SELECT eq_answer FROM app_exam_question WHERE eq_id = ?  LIMIT 1",
        [eq_id],
        (err, rows_question) => {
          let eq_answer = rows_question[0]?.eq_answer;
          if (eq_answer === ec_index) {
            score = 1;
          }
          // Update คำตอบและให้คะแนน
          con.query(
            "UPDATE  app_exam_cache SET ec_score=?,is_complete=?,ec_id=? WHERE eq_id=? AND em_id=?  AND user_id=? ",
            [score, 1, ec_id, eq_id, em_id, user_id],
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

router.post("/result/render", middleware, (req, res, next) => {
  const data = req.body;
  const em_id = data.em_id;
  const user_id = data.user_id;

  // เช็คคำตอบที่ถุกกำหนดในคำถาม
  con.query(
    " SELECT SUM(ec_score) AS sum_score, COUNT(*) AS total_question FROM app_exam_cache WHERE em_id	 = ? AND  user_id=? LIMIT 1 ",
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
        [sum_score, total_question, localISOTime, localISOTime, user_id, em_id],
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
          "INSERT INTO app_exam_time (et_time,em_id,user_id) VALUES (?,?,?)",
          [et_time, em_id, user_id],
          (err, rs) => {
            return res.json(rs);
          }
        );
      } else {
        con.query(
          "UPDATE  app_exam_time SET et_time=? WHERE em_id=?  AND user_id=?",
          [et_time, em_id, user_id],
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
  (SELECT   GROUP_CONCAT((JSON_OBJECT('user_firstname', t2.user_firstname,'user_lastname', t2.user_lastname , 'user_email', t2.user_email,'user_phone', t2.user_phone)))  FROM app_user t2 WHERE t2.user_id =  t1.user_id) AS out_user,
  (SELECT   GROUP_CONCAT((JSON_OBJECT('em_code', t3.em_code,'em_name', t3.em_name , 'em_cover', t3.em_cover, 'em_description', t3.em_description, 'em_random_amount', t3.em_random_amount , 'em_time', t3.em_time , 'dlt_code', t3.dlt_code)))  FROM app_exam_main t3 WHERE t3.em_id =  t1.em_id) AS out_em
  FROM app_exam_result t1 WHERE t1.em_id = ? AND t1.user_id = ? ORDER BY t1.er_id DESC 
  `;
  con.query(sql, [em_id, user_id], (err, rs) => {
    let obj = [];
    rs.forEach((el) => {
      // console.log(JSON.parse(el?.choices));
      let out_user = JSON.parse(el?.out_user);
      let out_em = JSON.parse(el?.out_em);
      let newObj = {
        er_id: el?.er_id,
        er_score_total: el?.er_score_total,
        er_question_total: el?.er_question_total,
        crt_date: el?.crt_date,
        udp_date: el?.udp_date,
        user_id: el?.user_id,
        em_id: el?.em_id,
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
  const offset = (current_page - 1) * per_page;
  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let param = [em_id];
  let sql = `
  SELECT
  t1.*,
  (SELECT   GROUP_CONCAT((JSON_OBJECT('user_firstname', t2.user_firstname,'user_lastname', t2.user_lastname , 'user_email', t2.user_email,'user_phone', t2.user_phone)))  FROM app_user t2 WHERE t2.user_id =  t1.user_id) AS out_user,
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
      let out_user = JSON.parse(el?.out_user);
      let out_em = JSON.parse(el?.out_em);
      let newObj = {
        er_id: el?.er_id,
        er_score_total: el?.er_score_total,
        er_question_total: el?.er_question_total,
        crt_date: el?.crt_date,
        udp_date: el?.udp_date,
        user_id: el?.user_id,
        em_id: el?.em_id,
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
      total_page: Math.ceil(total / per_page), // จำนวนหน้าทั้งหมด
      search: search, // คำค้นหา
      data: obj, // รายการข้อมูล
    };

    return res.json(response);
  });
});

module.exports = router;
