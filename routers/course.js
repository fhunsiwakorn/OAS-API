const express = require("express");
const router = express.Router();
const con = require("../database");
const middleware = require("../middleware");
const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
async function runQuery(sql, param) {
  return new Promise((resolve, reject) => {
    resolve(con.query(sql, param));
  });
}

router.post("/create", middleware, (req, res, next) => {
  const data = req.body;
  const user_id = data.user_id;

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

      con.query(
        "INSERT INTO app_course (course_cover,course_code,course_name,course_description,crt_date,udp_date,user_crt,user_udp) VALUES (?,?,?,?,?,?,?,?)",
        [
          data.course_cover,
          data.course_code,
          data.course_name,
          data.course_description,
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

router.put("/update/:course_id", middleware, (req, res, next) => {
  const { course_id } = req.params;
  const data = req.body;

  const user_id = data.user_id;
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

      con.query(
        "UPDATE  app_course SET course_cover=? , course_code=? ,course_name=? ,course_description=?,udp_date=? , user_udp=? WHERE course_id=? ",
        [
          data.course_cover,
          data.course_code,
          data.course_name,
          data.course_description,
          localISOTime,
          user_id,
          course_id,
        ],
        function (err, result) {
          if (err) throw err;

          return res.json(result);
        }
      );
    }
  );
});

router.delete("/delete/:course_id", middleware, (req, res, next) => {
  const { course_id } = req.params;
  con.query(
    "SELECT course_id FROM app_course WHERE course_id = ?",
    [course_id],
    (err, rows) => {
      let _content = rows.length;

      if (_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }

      con.query(
        "UPDATE  app_course SET cancelled=0 WHERE course_id=? ",
        [course_id],
        function (err, result) {
          if (err) throw err;
          // console.log("1 record inserted");
          return res.json(result);
        }
      );
    }
  );
});

router.post("/list", middleware, (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = (current_page - 1) * per_page;
  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let sql = `SELECT app_course.course_id,app_course.course_cover,app_course.course_code,app_course.course_name,app_course.course_description,app_course.crt_date,app_course.udp_date ,
   CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update
   FROM app_course LEFT JOIN  app_user u1 ON u1.user_id = app_course.user_crt  LEFT JOIN  app_user u2 ON u2.user_id = app_course.user_udp WHERE app_course.cancelled=1`;

  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_course WHERE  cancelled=1 ";
  con.query(sql_count, (err, results) => {
    let res = results[0];
    total = res !== undefined ? res?.numRows : 0;
  });
  if (search !== "" || search.length > 0) {
    let q = ` AND (app_course.course_code  LIKE ? OR app_course.course_name  LIKE  ? OR app_course.course_description  LIKE  ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  con.query(sql_count, search_param, (err, rows) => {
    let res = rows[0];
    total_filter = res !== undefined ? res?.numRows : 0;
  });

  sql += `  ORDER BY app_course.course_id DESC LIMIT ${offset},${per_page} `;

  // query ข้อมูล
  con.query(sql, search_param, (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request", // error.sqlMessage
      });
    }

    const response = {
      total: total, // จำนวนรายการทั้งหมด
      total_filter: total_filter, // จำนวนรายการทั้งหมด
      current_page: current_page, // หน้าที่กำลังแสดงอยู่
      limit_page: per_page, // limit data
      total_page: Math.ceil(total / per_page), // จำนวนหน้าทั้งหมด
      search: search, // คำค้นหา
      data: results, // รายการข้อมูล
    };
    return res.json(response);
  });
});

router.post("/lesson/create", middleware, (req, res, next) => {
  const data = req.body;
  const user_id = data.user_id;
  const course_id = data.course_id;
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

      con.query(
        "SELECT course_id FROM app_course WHERE course_id = ?",
        [course_id],
        (err, rows) => {
          let check_course = rows.length;
          if (check_course <= 0) {
            return res.status(204).json({
              status: 204,
              message: "Data is null", // error.sqlMessage
            });
          }
          con.query(
            "INSERT INTO app_course_lesson (cs_cover,cs_name,cs_video,cs_description,crt_date,udp_date,course_id,user_crt,user_udp) VALUES (?,?,?,?,?,?,?,?,?)",
            [
              data.cs_cover,
              data.cs_name,
              data.cs_video,
              data.cs_description,
              localISOTime,
              localISOTime,
              course_id,
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
    }
  );
});

router.put("/lesson/update/:cs_id", middleware, (req, res, next) => {
  const { cs_id } = req.params;
  const data = req.body;
  const user_id = data.user_id;
  const course_id = data.course_id;
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

      con.query(
        "UPDATE  app_course_lesson SET cs_cover=? , cs_name=? ,cs_video=? ,cs_description=?,udp_date=? ,course_id=?, user_udp=? WHERE cs_id=? ",
        [
          data.cs_cover,
          data.cs_name,
          data.cs_video,
          data.cs_description,
          localISOTime,
          course_id,
          user_id,
          cs_id,
        ],
        function (err, result) {
          if (err) throw err;

          return res.json(result);
        }
      );
    }
  );
});

router.delete("/lesson/delete/:cs_id", middleware, (req, res, next) => {
  const { cs_id } = req.params;
  con.query(
    "SELECT course_id FROM app_course_lesson WHERE cs_id = ?",
    [cs_id],
    (err, rows) => {
      let _content = rows.length;

      if (_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }

      con.query(
        "UPDATE  app_course_lesson SET cancelled=0 WHERE cs_id=? ",
        [cs_id],
        function (err, result) {
          if (err) throw err;
          // console.log("1 record inserted");
          return res.json(result);
        }
      );
    }
  );
});

router.post("/lesson/list/:course_id", middleware, (req, res, next) => {
  const { course_id } = req.params;
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = (current_page - 1) * per_page;
  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let sql = `SELECT app_course_lesson.cs_id,app_course_lesson.cs_cover,app_course_lesson.cs_name,app_course_lesson.cs_video,app_course_lesson.cs_description,app_course_lesson.crt_date,app_course_lesson.udp_date ,
     CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update
     FROM app_course_lesson LEFT JOIN  app_user u1 ON u1.user_id = app_course_lesson.user_crt  LEFT JOIN  app_user u2 ON u2.user_id = app_course_lesson.user_udp WHERE app_course_lesson.cancelled=1 AND app_course_lesson.course_id=?`;
  let p = [course_id];

  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_course_lesson WHERE  app_course_lesson.cancelled=1 AND app_course_lesson.course_id =? ";
  con.query(sql_count, p, (err, results) => {
    let res = results[0];
    total = res !== undefined ? res?.numRows : 0;
  });

  if (search !== "" || search.length > 0) {
    let q = ` AND (app_course_lesson.cs_name  LIKE ? OR app_course_lesson.cs_description  LIKE  ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`, `%${search}%`];
  }

  con.query(sql_count, p.concat(search_param), (err, rows) => {
    let res = rows[0];
    total_filter = res !== undefined ? res?.numRows : 0;
  });

  sql += `  ORDER BY app_course_lesson.cs_id DESC LIMIT ${offset},${per_page} `;

  // query ข้อมูล
  con.query(sql, p.concat(search_param), (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request", // error.sqlMessage
      });
    }

    const response = {
      total: total, // จำนวนรายการทั้งหมด
      total_filter: total_filter, // จำนวนรายการทั้งหมด
      current_page: current_page, // หน้าที่กำลังแสดงอยู่
      limit_page: per_page, // limit data
      total_page: Math.ceil(total / per_page), // จำนวนหน้าทั้งหมด
      search: search, // คำค้นหา
      data: results, // รายการข้อมูล
    };
    return res.json(response);
  });
});

router.get("/lesson/get/:cs_id", middleware, (req, res, next) => {
  const { cs_id } = req.params;
  con.query(
    "SELECT * FROM app_course_lesson WHERE cs_id = ?",
    [cs_id],
    (err, rows) => {
      let _content = rows.length;

      if (_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }

      const reslut = rows[0];
      const response = {
        cs_id: reslut?.cs_id,
        cs_cover: reslut?.cs_cover,
        cs_name: reslut?.cs_name,
        cs_video: reslut?.cs_video,
        cs_description: reslut?.cs_description,
        crt_date: reslut?.crt_date,
        udp_date: reslut?.udp_date,
        course_id: reslut?.course_id,
      };
      return res.json(response);
    }
  );
});

router.post("/log/create", middleware, (req, res, next) => {
  const data = req.body;
  const cs_id = data.cs_id;
  const user_id = data.user_id;
  con.query(
    "SELECT * FROM app_course_lesson WHERE cs_id = ?",
    [cs_id],
    (err, rows) => {
      let checkuser = rows?.length;
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Username Error", // error.sqlMessage
        });
      }
      con.query(
        "INSERT INTO app_course_log (cs_id,user_id,udp_date) VALUES (?,?,?)",
        [cs_id, user_id, localISOTime],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.get("/log/lesson/:cs_id/:year", middleware, async (req, res, next) => {
  const { cs_id, year } = req.params;

  let obj = [];
  for (let i = 1; i <= 12; i++) {
    let getLog = await runQuery(
      "SELECT COUNT(cs_id) AS total FROM app_course_log WHERE cs_id = ? AND MONTH(udp_date) = ?  AND  YEAR(udp_date) = ? ",
      [cs_id, i, year]
    );
    let newObj = {
      month: i,
      total: getLog[0]?.total,
    };
    obj.push(newObj);
  }
  return res.json(obj);
});

router.get(
  "/log/course/:course_id/:year",
  middleware,
  async (req, res, next) => {
    const { course_id, year } = req.params;

    let obj = [];
    for (let i = 1; i <= 12; i++) {
      let getLog = await runQuery(
        `SELECT COUNT(t1.cs_id) AS total 
        FROM app_course_log t1  
        INNER JOIN  app_course_lesson t2 ON t2.cs_id = t1.cs_id   
        INNER JOIN  app_course t3 ON t3.course_id = t2.course_id AND  t3.course_id = ?
        WHERE  MONTH(t1.udp_date) = ?  AND  YEAR(t1.udp_date) = ? `,
        [course_id, i, year]
      );
      let newObj = {
        month: i,
        total: getLog[0]?.total,
      };
      obj.push(newObj);
    }
    return res.json(obj);
  }
);

router.get(
  "/log/course/:course_id/:year?",
  middleware,
  async (req, res, next) => {
    const { course_id, year } = req.params;
    const user_id = req.query.user_id;
    let obj = [];
    for (let i = 1; i <= 12; i++) {
      let getLog = await runQuery(
        `SELECT COUNT(t1.cs_id) AS total 
        FROM app_course_log t1  
        INNER JOIN  app_course_lesson t2 ON t2.cs_id = t1.cs_id   
        INNER JOIN  app_course t3 ON t3.course_id = t2.course_id AND  t3.course_id = ?
        WHERE  MONTH(t1.udp_date) = ?  AND  YEAR(t1.udp_date) = ? AND t1.user_id = ?`,
        [course_id, i, year, user_id]
      );
      let newObj = {
        month: i,
        total: getLog[0]?.total,
      };
      obj.push(newObj);
    }
    return res.json(obj);
  }
);

module.exports = router;
