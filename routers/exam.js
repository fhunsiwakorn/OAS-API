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
        "INSERT INTO app_exam_main (em_code,em_name,em_cover,em_description,em_random_amount,em_time,crt_date,udp_date,user_crt,user_udp) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
          data.em_code,
          data.em_name,
          data.em_cover,
          data.em_description,
          data.em_random_amount,
          data.em_time,
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
        "UPDATE  app_exam_main SET em_code=? , em_name=? ,em_cover=? ,em_description=?,em_random_amount=?,em_time=?,udp_date=?,user_udp=? WHERE em_id=? ",
        [
          data.em_code,
          data.em_name,
          data.em_cover,
          data.em_description,
          data.em_random_amount,
          data.em_time,
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
  let sql = `SELECT app_exam_main.em_id,app_exam_main.em_code,app_exam_main.em_name,app_exam_main.em_cover,app_exam_main.em_description,app_exam_main.em_random_amount,app_exam_main.em_time,app_exam_main.crt_date,app_exam_main.udp_date ,
     CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update, COUNT(q.eq_id) AS total_question
     FROM app_exam_main 
     LEFT JOIN  app_user u1 ON u1.user_id = app_exam_main.user_crt  
     LEFT JOIN  app_user u2 ON u2.user_id = app_exam_main.user_udp 
     LEFT JOIN  app_exam_question q ON q.em_id = app_exam_main.em_id 
     WHERE app_exam_main.cancelled=1`;
  let group = " GROUP BY  app_exam_main.em_id ";
  let order = ` ORDER BY app_exam_main.em_id DESC LIMIT ${offset},${per_page} `;
  con.query(sql + group, (err, results) => {
    total = results.length;
  });

  if (search !== "" || search.length > 0) {
    sql += ` AND (app_exam_main.em_code  LIKE ? OR app_exam_main.em_name  LIKE  ? OR app_exam_main.em_description  LIKE  ?)`; //
    search_param = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  con.query(sql + group, search_param, (err, rows) => {
    total_filter = rows.length;
  });

  // sql += ` ORDER BY app_exam_main.em_id DESC LIMIT ${offset},${per_page} `;

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
	CONCAT('[',(SELECT    GROUP_CONCAT((JSON_OBJECT('ec_id', t2.ec_id,'ec_index', t2.ec_index,'ec_name', t2.ec_name,'ec_image', t2.ec_image,'eq_id', t2.eq_id,'em_id', t2.em_id)))  FROM app_exam_choice t2  WHERE eq_id =  t1.eq_id AND cancelled=1 ) ,']') AS choices
FROM
	app_exam_question t1
	WHERE
  t1.em_id =? AND
	t1.cancelled =1
  `;
  let param1 = [em_id];
  con.query(sql, param1, (err, results) => {
    total = results.length;
  });

  if (search !== "" || search.length > 0) {
    sql += ` AND (t1.eq_name  LIKE ?)`; //
    search_param = [`%${search}%`];
  }

  con.query(sql, param1.concat(search_param), (err, rows) => {
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
    "SELECT em_id FROM app_exam_question WHERE eq_id = ?  LIMIT 1",
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
        "SELECT ec_index FROM app_exam_choice WHERE eq_id = ? AND ec_index=? ",
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
        "SELECT ec_index FROM app_exam_choice WHERE eq_id = ? AND ec_index=? AND ec_id !=?",
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

module.exports = router;
