const express = require("express");
const router = express.Router();
const con = require("../database");
const middleware = require("../middleware");
const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
const common = require("../common");

router.post("/create", middleware, (req, res, next) => {
  const data = req.body;
  const user_id = data.user_id;
  const dlt_code = data.dlt_code;
  const ap_learn_type = data.ap_learn_type;
  const obj = common.drivinglicense_type;
  const result_filter = obj.filter(function (e) {
    return e.dlt_code === dlt_code;
  });

  const check_start = new Date(data.ap_date_start).getTime();
  const check_end = new Date(data.ap_date_end).getTime();

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
      if (result_filter.length <= 0) {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'dlt_code' ",
        });
      }
      if (ap_learn_type !== 1 && ap_learn_type !== 2) {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'ap_learn_type' ",
        });
      }
      if (check_start > check_end || check_start === NaN || check_end === NaN) {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'ap_date_start' , 'ap_date_end' ", // error.sqlMessage
        });
      }
      con.query(
        "INSERT INTO app_appointment (ap_learn_type,ap_quota,ap_date_start,ap_date_end,ap_remark,dlt_code,crt_date,udp_date,user_crt,user_udp) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
          ap_learn_type,
          data.ap_quota,
          data.ap_date_start,
          data.ap_date_end,
          data.ap_remark,
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

router.put("/update/:ap_id", middleware, (req, res, next) => {
  const { ap_id } = req.params;
  const data = req.body;
  const user_id = data.user_id;
  const dlt_code = data.dlt_code;
  const ap_learn_type = data.ap_learn_type;
  const obj = common.drivinglicense_type;
  const result_filter = obj.filter(function (e) {
    return e.dlt_code === dlt_code;
  });
  const check_start = new Date(data.ap_date_start).getTime();
  const check_end = new Date(data.ap_date_end).getTime();

  let _check_appointment = 0;
  con.query(
    " SELECT ap_id FROM app_appointment WHERE ap_id = ? LIMIT 1",
    [ap_id],
    function (err, result) {
      if (err) throw err;
      _check_appointment = result.length;
    }
  );

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
      if (result_filter.length <= 0) {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'dlt_code' ",
        });
      }
      if (ap_learn_type !== 1 && ap_learn_type !== 2) {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'ap_learn_type' ",
        });
      }
      if (_check_appointment <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null", // error.sqlMessage
        });
      }
      if (check_start > check_end || check_start === NaN || check_end === NaN) {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'ap_date_start' , 'ap_date_end' ", // error.sqlMessage
        });
      }
      con.query(
        "UPDATE  app_appointment SET ap_learn_type=? ,ap_quota=? , ap_date_start=?, ap_date_end=?, ap_remark=?,dlt_code=? ,udp_date=? , user_udp=? WHERE ap_id=? ",
        [
          ap_learn_type,
          data.ap_quota,
          data.ap_date_start,
          data.ap_date_end,
          data.ap_remark,
          data.dlt_code,
          localISOTime,
          user_id,
          ap_id,
        ],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.get("/get/:ap_id", middleware, (req, res, next) => {
  const { ap_id } = req.params;
  let sql = `SELECT t1.ap_id ,t1.ap_learn_type,t1.ap_quota,t1.ap_date_start,t1.ap_date_end,t1.ap_remark,t1.dlt_code,t1.crt_date,t1.udp_date,
  CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update
  FROM app_appointment t1 LEFT JOIN  app_user u1 ON u1.user_id = t1.user_crt  LEFT JOIN  app_user u2 ON u2.user_id = t1.user_udp WHERE t1.cancelled=1 AND t1.ap_id =?`;

  con.query(sql, [ap_id], function (err, rs) {
    if (rs.length <= 0) {
      return res.status(204).json({
        status: 204,
        message: "Data is null", // error.sqlMessage
      });
    }

    res.json(rs[0]);
  });
});

router.delete("/delete/:ap_id", middleware, (req, res, next) => {
  const { ap_id } = req.params;
  con.query(
    "SELECT ap_id  FROM app_appointment WHERE ap_id  = ? LIMIT 1",
    [ap_id],
    (err, rows) => {
      let _content = rows.length;

      if (_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }
      con.query(
        "UPDATE  app_appointment SET cancelled=0 WHERE ap_id=? ",
        [ap_id],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.post("/list", middleware, (req, res, next) => {
  const data = req.body;
  const start_date = new Date(data.start_date);
  const end_date = new Date(data.end_date);
  const dlt_code = data.dlt_code;
  const check_start = start_date.getTime();
  const check_end = end_date.getTime();

  let sql = `
SELECT 
DATE_FORMAT(t1.ap_date_start,"%Y-%m-%d") AS date_group,
IFNULL(CONCAT('[',(SELECT   GROUP_CONCAT((JSON_OBJECT('ap_id', t3.ap_id,'ap_learn_type', t3.ap_learn_type,'ap_quota', t3.ap_quota , 'ap_date_start', t3.ap_date_start,'ap_date_end', t3.ap_date_end,'ap_remark', t3.ap_remark,'dlt_code', t3.dlt_code,'total_reserv', (SELECT COUNT(*) FROM app_appointment_reserve t4 WHERE t4.ap_id=t3.ap_id) ))) 
FROM app_appointment t3  WHERE t3.dlt_code = t1.dlt_code AND DATE(t3.ap_date_start) = date_group AND t3.cancelled=1 ORDER BY t3.ap_date_start ASC ) ,']'),'[]') AS events
FROM app_appointment t1 
LEFT JOIN  app_user u1 ON u1.user_id = t1.user_crt 
LEFT JOIN  app_user u2 ON u2.user_id = t1.user_udp
WHERE t1.cancelled=1 AND
t1.dlt_code = ? AND
DATE(t1.ap_date_start) >= ? AND  DATE(t1.ap_date_end) <= ? 
GROUP BY date_group
ORDER BY t1.ap_date_start ASC
 `;

  con.query(
    sql,
    [
      dlt_code,
      start_date.toISOString().split("T")[0],
      end_date.toISOString().split("T")[0],
    ],
    (err, results) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          message: "Bad Request",
        });
      }
      // console.log(results);
      if (check_start > check_end || check_start === NaN || check_end === NaN) {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'start_date' , 'end_date' ",
        });
      }
      let obj = [];
      results.forEach((el) => {
        // console.log(JSON.parse(el?.choices));
        let events = JSON.parse(el?.events);
        let newObj = {
          date_group: el?.date_group,
          events: events,
        };
        obj.push(newObj);
      });

      return res.json(obj);
    }
  );
});

router.post("/reserve/create", middleware, (req, res, next) => {
  const data = req.body;
  const user_id = data.user_id;
  const ap_id = data.ap_id;
  let _check_reserve = 0;
  let _check_appointment = 0;

  con.query(
    " SELECT user_id FROM app_appointment_reserve WHERE ap_id = ? AND user_id=? LIMIT 1 ",
    [ap_id, user_id],
    function (err, result) {
      if (err) throw err;
      _check_reserve = result.length;
    }
  );
  con.query(
    " SELECT ap_id FROM app_appointment WHERE ap_id = ? LIMIT 1",
    [ap_id],
    function (err, result) {
      if (err) throw err;
      _check_appointment = result.length;
    }
  );

  con.query(
    "SELECT user_id FROM app_user WHERE user_id = ? LIMIT 1",
    [user_id],
    (err, rows) => {
      if (rows.length <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Username Error", // error.sqlMessage
        });
      }

      if (_check_appointment <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null", // error.sqlMessage
        });
      }
      if (_check_reserve >= 1) {
        return res.status(404).json({
          status: 404,
          message:
            "You have entered an ap_id and user_id that already exists in this column. Only unique ap_id and user_id are allowed.",
        });
      }

      con.query(
        "INSERT INTO app_appointment_reserve (ap_id,user_id,user_udp) VALUES (?,?,?)",
        [ap_id, user_id, localISOTime],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});
router.delete("/reserve/delete/:ar_id", middleware, (req, res, next) => {
  const { ar_id } = req.params;
  con.query(
    "SELECT ar_id FROM app_appointment_reserve WHERE ar_id = ? LIMIT 1",
    [ar_id],
    (err, rows) => {
      if (rows.length <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null", // error.sqlMessage
        });
      }
      con.query(
        "  DELETE FROM  app_appointment_reserve WHERE ar_id=? ",
        [ar_id],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.get("/reserve/get/:user_id", middleware, (req, res, next) => {
  const { user_id } = req.params;
  let sql = `
  SELECT t1.*, 
  (SELECT   GROUP_CONCAT((JSON_OBJECT('ap_id', t5.ap_id,'ap_learn_type', t5.ap_learn_type,'ap_quota', t5.ap_quota , 'ap_date_start', t5.ap_date_start,'ap_date_end', t5.ap_date_end,'ap_remark', t5.ap_remark,'dlt_code', t5.dlt_code)))  FROM app_appointment t5  WHERE t5.ap_id =  t1.ap_id ) AS appointment_detail
  FROM app_appointment_reserve t1  INNER JOIN app_appointment t2 ON t2.ap_id = t1.ap_id AND t2.cancelled=1 WHERE t1.user_id = ? 
  `;
  con.query(sql, [user_id], function (err, result) {
    if (err) throw err;
    let obj = [];
    result.forEach((el) => {
      let appointment_detail = JSON.parse(el?.appointment_detail);
      let newObj = {
        ar_id: el?.ar_id,
        ap_id: el?.ap_id,
        user_id: el?.user_id,
        user_udp: el?.user_udp,
        appointment_detail: appointment_detail,
      };
      obj.push(newObj);
    });

    return res.json(obj);
  });
});

router.post("/reserve/get/:ap_id", middleware, (req, res, next) => {
  const { ap_id } = req.params;
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = (current_page - 1) * per_page;
  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let sql = `
  SELECT t1.*,
  (SELECT   GROUP_CONCAT((JSON_OBJECT('user_id', t3.user_id,'user_firstname', t3.user_firstname,'user_lastname', t3.user_lastname , 'user_email', t3.user_email,'user_phone', t3.user_phone,'identification_number', t7.identification_number)))  FROM app_user t3   INNER JOIN app_user_detail t7 ON t7.user_id = t3.user_id WHERE t3.user_id =  t1.user_id) AS user_reserve,
  (SELECT   GROUP_CONCAT((JSON_OBJECT('ap_id', t5.ap_id,'ap_learn_type', t5.ap_learn_type,'ap_quota', t5.ap_quota , 'ap_date_start', t5.ap_date_start,'ap_date_end', t5.ap_date_end,'ap_remark', t5.ap_remark,'dlt_code', t5.dlt_code)))  FROM app_appointment t5  WHERE t5.ap_id =  t1.ap_id ) AS appointment_detail
  FROM app_appointment_reserve t1  
  INNER JOIN app_appointment t2 ON t2.ap_id = t1.ap_id AND t2.cancelled=1 
  INNER JOIN app_user t4 ON t4.user_id = t1.user_id
  INNER JOIN app_user_detail t6 ON t6.user_id = t1.user_id
  WHERE t1.ap_id = ?

    `;
  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_appointment_reserve  t1 INNER JOIN app_user t4 ON t4.user_id = t1.user_id   INNER JOIN app_user_detail t6 ON t6.user_id = t4.user_id WHERE  t1.ap_id=?  ";
  con.query(sql_count, [ap_id], (err, results) => {
    let res = results[0];
    total = res !== undefined ? res?.numRows : 0;
  });
  if (search !== "" || search.length > 0) {
    let q = ` AND (t4.user_firstname  LIKE ? OR t4.user_lastname  LIKE  ?  OR t6.identification_number  LIKE  ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`, `%${search}%`, `%${search}%`];
  }
  con.query(sql_count, [ap_id].concat(search_param), (err, rows) => {
    let res = rows[0];
    total_filter = res !== undefined ? res?.numRows : 0;
  });

  sql += `  ORDER BY t1.ar_id DESC LIMIT ${offset},${per_page} `;
  con.query(sql, [ap_id].concat(search_param), function (err, result) {
    if (err) throw err;
    let obj = [];
    result.forEach((el) => {
      let user_reserve = JSON.parse(el?.user_reserve);
      let appointment_detail = JSON.parse(el?.appointment_detail);
      let newObj = {
        ar_id: el?.ar_id,
        ap_id: el?.ap_id,
        user_id: el?.user_id,
        user_udp: el?.user_udp,
        user_reserve: user_reserve,
        appointment_detail: appointment_detail,
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
