const express = require("express");
const router = express.Router();
const con = require("../database");
const fs = require("fs");
const middleware = require("../middleware");
const functions = require("../functions");

async function runQuery(sql, param) {
  return new Promise((resolve, reject) => {
    resolve(con.query(sql, param));
  });
}
async function delFile(path) {
  var filePath = path;
  fs.unlinkSync(filePath);
  res.end();
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
        "INSERT INTO app_course (course_cover,course_code,course_name,course_description,course_remark_a,course_remark_b,crt_date,udp_date,user_crt,user_udp) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
          data.course_cover,
          data.course_code,
          data.course_name,
          data.course_description,
          data.course_remark_a,
          data.course_remark_b,
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
        "UPDATE  app_course SET course_cover=? , course_code=? ,course_name=? ,course_description=?,course_remark_a=?,course_remark_b=?,udp_date=? , user_udp=? WHERE course_id=? ",
        [
          data.course_cover,
          data.course_code,
          data.course_name,
          data.course_description,
          data.course_remark_a,
          data.course_remark_b,
          functions.dateAsiaThai(),
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

router.post("/list", middleware, async (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = functions.setZero((current_page - 1) * per_page);

  let search_param = [];
  let sql = `SELECT 
  app_course.course_id,
  app_course.course_cover,
  app_course.course_code,
  app_course.course_name,
  app_course.course_description,
  app_course.course_remark_a,
  app_course.course_remark_b,
  app_course.is_complete,
  app_course.crt_date,
  app_course.udp_date ,
  CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update ,
  (SELECT COUNT(app_course_lesson.cg_id)  AS total  FROM  app_course_cluster INNER JOIN app_course_lesson ON app_course_cluster.cs_id = app_course_lesson.cs_id  WHERE app_course_cluster.course_id=app_course.course_id  GROUP BY app_course_lesson.cg_id LIMIT 1) AS total_course_group ,
  (SELECT COUNT(app_course_lesson.cs_id)  AS total  FROM  app_course_cluster INNER JOIN app_course_lesson ON app_course_cluster.cs_id = app_course_lesson.cs_id  WHERE app_course_cluster.course_id=app_course.course_id  LIMIT 1) AS total_lesson ,
  (SELECT COUNT(app_course_lesson.cs_id)  AS total  FROM  app_course_cluster INNER JOIN app_course_lesson ON app_course_cluster.cs_id = app_course_lesson.cs_id  WHERE app_course_cluster.course_id=app_course.course_id AND  app_course_lesson.cs_video != ''   LIMIT 1) AS total_video
  FROM app_course 
   LEFT JOIN  app_user u1 ON u1.user_id = app_course.user_crt  
   LEFT JOIN  app_user u2 ON u2.user_id = app_course.user_udp 
   WHERE app_course.cancelled=1`;

  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_course WHERE  cancelled=1 ";

  let getCountAll = await runQuery(sql_count);
  const total = getCountAll[0] !== undefined ? getCountAll[0]?.numRows : 0;

  if (search !== "" || search.length > 0) {
    let q = ` AND (app_course.course_code  LIKE ? OR app_course.course_name  LIKE  ? OR app_course.course_description  LIKE  ? OR app_course.course_remark_a  LIKE  ? OR app_course.course_remark_b  LIKE  ?)`; //
    sql += q;
    sql_count += q;
    search_param = [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    ];
  }

  let getCountFilter = await runQuery(sql_count, search_param);
  const total_filter =
    getCountFilter[0] !== undefined ? getCountFilter[0]?.numRows : 0;

  sql += `  ORDER BY app_course.course_id ASC LIMIT ${offset},${per_page} `;

  let getContent = await runQuery(sql, search_param);
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

router.get("/get/:course_id", middleware, (req, res, next) => {
  const { course_id } = req.params;
  con.query(
    "SELECT * FROM app_course WHERE course_id = ? AND cancelled = 1",
    [course_id],
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
        course_id: reslut?.course_id,
        course_cover: reslut?.course_cover,
        course_code: reslut?.course_code,
        course_name: reslut?.course_name,
        course_description: reslut?.course_description,
        course_remark_a: reslut?.course_remark_a,
        course_remark_b: reslut?.course_remark_b,
        crt_date: reslut?.crt_date,
        udp_date: reslut?.udp_date,
      };
      return res.json(response);
    }
  );
});

router.post("/lesson/create", middleware, (req, res, next) => {
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
        "INSERT INTO app_course_lesson (cs_cover,cs_name,cs_video,cs_description,crt_date,udp_date,user_crt,user_udp,cg_id) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          data.cs_cover,
          data.cs_name,
          data.cs_video,
          data.cs_description,
          functions.dateAsiaThai(),
          functions.dateAsiaThai(),
          user_id,
          user_id,
          data.cg_id,
        ],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.put("/lesson/update/:cs_id", middleware, (req, res, next) => {
  const { cs_id } = req.params;
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
        "UPDATE  app_course_lesson SET cs_cover=? , cs_name=? ,cs_video=? ,cs_description=?,udp_date=? , user_udp=? ,cg_id=? WHERE cs_id=? ",
        [
          data.cs_cover,
          data.cs_name,
          data.cs_video,
          data.cs_description,
          functions.dateAsiaThai(),
          user_id,
          data.cg_id,
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

router.post("/lesson/all", middleware, async (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const exclude = data.exclude;
  const offset = functions.setZero((current_page - 1) * per_page);
  const cg_id = req.query.cg_id;
  let ex = '("0")';
  if (exclude.length > 0) {
    const toArr = exclude.toString();
    ex = `(${toArr})`;
  }
  let search_param = [];
  let sql = `SELECT app_course_lesson.cs_id,app_course_lesson.cs_cover,app_course_lesson.cs_name,app_course_lesson.cs_video,app_course_lesson.cs_description,app_course_lesson.crt_date,app_course_lesson.udp_date ,app_course_lesson.cg_id ,
  cg.cg_name,   
  CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update
     FROM app_course_lesson  LEFT JOIN  app_user u1 ON u1.user_id = app_course_lesson.user_crt  LEFT JOIN  app_user u2 ON u2.user_id = app_course_lesson.user_udp  LEFT JOIN  app_course_group cg ON cg.cg_id  = app_course_lesson.cg_id 
WHERE 
app_course_lesson.cancelled=1 AND 
app_course_lesson.cs_id NOT IN ${ex}
`;
  let p = [];

  let sql_count = ` SELECT  COUNT(*) as numRows FROM  app_course_lesson WHERE  app_course_lesson.cancelled=1 AND app_course_lesson.cs_id NOT IN ${ex}`;
  if (cg_id !== "" && cg_id !== 0 && cg_id !== undefined) {
    let x = ` AND app_course_lesson.cg_id ='${cg_id}'`; //
    sql += x;
    sql_count += x;
  } else {
    let x = ` AND app_course_lesson.cg_id > 0`; //
    sql += x;
    sql_count += x;
  }

  const getCountAll = await runQuery(sql_count, p);
  const total = getCountAll[0] !== undefined ? getCountAll[0]?.numRows : 0;

  if (search !== "" || search.length > 0) {
    let q = ` AND (app_course_lesson.cs_name  LIKE ? OR app_course_lesson.cs_description  LIKE  ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`, `%${search}%`];
  }

  const getCountFilter = await runQuery(sql_count, p.concat(search_param));
  const total_filter =
    getCountFilter[0] !== undefined ? getCountFilter[0]?.numRows : 0;

  sql += `  ORDER BY app_course_lesson.cs_id ASC LIMIT ${offset},${per_page} `;
  const getContent = await runQuery(sql, p.concat(search_param));
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

router.delete("/lesson/delete/:cs_id", middleware, (req, res, next) => {
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

router.post(
  "/cluster/create/:course_id",
  middleware,
  async (req, res, next) => {
    const data = req.body;
    const { course_id } = req.params;
    const total = data.length;
    if (total <= 0) {
      return res.status(400).json({
        status: 400,
        message: "Error Transaction",
      });
    }
    // Clear Last Data
    await runQuery("DELETE FROM app_course_cluster WHERE course_id = ? ", [
      course_id,
    ]);
    // Update Course
    await runQuery(
      "UPDATE  app_course SET is_complete=1 ,udp_date=?  WHERE course_id = ? ",
      [functions.dateAsiaThai(), course_id]
    );
    let sql =
      " INSERT INTO app_course_cluster (cct_id,cs_id,course_id) VALUES ? ";
    let obj = [];
    data.forEach((el) => {
      let newObj = [
        `${functions.randomCode()}`,
        `${el?.cs_id}`,
        `${course_id}`,
      ];
      obj.push(newObj);
    });

    const r = await runQuery(sql, [obj]);
    return res.json(r);
  }
);

router.delete(
  "/cluster/empty/:course_id",
  middleware,
  async (req, res, next) => {
    const { course_id } = req.params;
    // Update Course
    await runQuery(
      "UPDATE  app_course SET is_complete=0 ,udp_date=?  WHERE course_id = ? ",
      [functions.dateAsiaThai(), course_id]
    );
    const r = // Clear Last Data
      await runQuery("DELETE FROM app_course_cluster WHERE course_id = ? ", [
        course_id,
      ]);
    return res.json(r);
  }
);
router.delete("/cluster/delete", middleware, (req, res, next) => {
  const course_id = req.query.course_id;
  const cs_id = req.query.cs_id;
  con.query(
    "DELETE FROM app_course_cluster WHERE course_id = ? AND cs_id= ?",
    [course_id, cs_id],
    function (err, result) {
      if (err) throw err;

      return res.json(result);
    }
  );
});

router.post("/lesson/list/:course_id", middleware, async (req, res, next) => {
  const { course_id } = req.params;

  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = functions.setZero((current_page - 1) * per_page);
  let search_param = [];
  let sql = `SELECT app_course_lesson.cs_id,app_course_lesson.cs_cover,app_course_lesson.cs_name,app_course_lesson.cs_video,app_course_lesson.cs_description ,app_course_lesson.crt_date,app_course_lesson.udp_date ,
  cg.cg_name,     
  CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update
     FROM  app_course_cluster 
     INNER JOIN  app_course_lesson  ON app_course_lesson.cs_id = app_course_cluster.cs_id  
     LEFT JOIN  app_user u1 ON u1.user_id = app_course_lesson.user_crt  LEFT JOIN  app_user u2 ON u2.user_id = app_course_lesson.user_udp 
     LEFT JOIN  app_course_group cg ON cg.cg_id  = app_course_lesson.cg_id 
     WHERE app_course_lesson.cancelled=1 AND app_course_cluster.course_id=?`;
  let p = [course_id];

  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_course_cluster WHERE  app_course_cluster.course_id =? ";

  const getCountAll = await runQuery(sql_count, p);
  const total = getCountAll[0] !== undefined ? getCountAll[0]?.numRows : 0;
  if (total <= 0) {
    return res.status(400).json({
      status: 400,
      message: "Error Transactions",
    });
  }

  if (search !== "" || search.length > 0) {
    let q = ` AND (app_course_lesson.cs_name  LIKE ? OR app_course_lesson.cs_description  LIKE  ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`, `%${search}%`];
  }

  const getCountFilter = await runQuery(sql_count, p.concat(search_param));
  const total_filter =
    getCountFilter[0] !== undefined ? getCountFilter[0]?.numRows : 0;

  sql += ` GROUP BY app_course_lesson.cs_id ORDER BY app_course_lesson.cs_name DESC LIMIT ${offset},${per_page} `;
  const getContent = await runQuery(sql, p.concat(search_param));
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

router.get("/get/option/:course_id", middleware, async (req, res, next) => {
  const { course_id } = req.params;
  const user_id = req.query.user_id;
  const course_content = await runQuery(
    `SELECT
    app_course_group.cg_id,
    app_course_group.cg_name,
    COUNT(app_course_cluster.cs_id) AS total_lesson
    FROM app_course_cluster 
    INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
    INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
    WHERE  app_course_cluster.course_id= ? GROUP BY app_course_group.cg_id ORDER BY  app_course_group.cg_id ASC
    `,
    [course_id]
  );
  let obj = [];
  for (let i = 0; i < course_content.length; i++) {
    let el = course_content[i];
    let lessons = await runQuery(
      `SELECT
      app_course_lesson.cs_id,
      app_course_lesson.cs_cover,
      app_course_lesson.cs_name,
      app_course_lesson.cs_video,
      app_course_lesson.cs_description,
      app_course_lesson.crt_date,
      app_course_lesson.udp_date,
      app_course_cluster.course_id,
      IF((SELECT COUNT(cs_id) AS total FROM app_course_log  WHERE user_id=? AND  cs_id=app_course_lesson.cs_id AND course_id=app_course_cluster.course_id ) < 1, "false", "true") AS learning_status
       
      FROM app_course_cluster 
      INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
      INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
      WHERE  app_course_cluster.course_id= ? AND app_course_lesson.cg_id=?
      ORDER BY  app_course_lesson.cs_id ASC
      `,
      [user_id, course_id, el?.cg_id]
    );
    let newObj = {
      cg_id: el?.cg_id,
      cg_name: el?.cg_name,
      total_lesson: el?.total_lesson,
      lessons: lessons,
    };
    obj.push(newObj);
  }

  return res.json(obj);
});

router.get("/lesson/list/learn/q", middleware, async (req, res, next) => {
  const course_id = req.query.course_id;
  const cg_id = req.query.cg_id;
  const user_id = req.query.user_id;
  const cs_id = req.query.cs_id;
  if (
    course_id === undefined ||
    cg_id === undefined ||
    user_id === undefined ||
    cs_id === undefined
  ) {
    return res.status(404).json({
      status: 404,
      message: "Invalid  Data",
    });
  }

  let sql = `
  SELECT 
  app_course_lesson.cs_id,
  app_course_lesson.cs_cover,
  app_course_lesson.cs_name,
  app_course_lesson.cs_video,
  app_course_lesson.cs_description,
  app_course_lesson.crt_date,
  app_course_lesson.udp_date,
  app_course_cluster.course_id,
  app_course_group.cg_id,
  app_course_group.cg_name
  FROM app_course_cluster 
  INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
  INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
  WHERE
  app_course_group.cg_id = ? AND 
  app_course_cluster.course_id = ? AND
  app_course_cluster.cs_id = ?
   `;
  let sql_count = ` SELECT  COUNT(*) as numRows 
   FROM  
   app_course_cluster 
   INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
   INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
   WHERE  
   app_course_group.cg_id = ? AND 
   app_course_cluster.course_id = ? LIMIT 0,1`;

  let sql_next = ` SELECT  
   app_course_group.cg_id,
   app_course_group.cg_name
   FROM  
   app_course_cluster 
   INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
   INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
   WHERE  
   app_course_group.cg_id > ? AND 
   app_course_cluster.course_id = ? ORDER BY  app_course_group.cg_id ASC  LIMIT 0,1`;
  let sql_previous = ` SELECT  
  app_course_group.cg_id,
   app_course_group.cg_name
   FROM  
   app_course_cluster 
   INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
   INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
   WHERE  
   app_course_group.cg_id < ? AND 
   app_course_cluster.course_id = ? ORDER BY  app_course_group.cg_id DESC LIMIT 0,1`;

  let sql_curent = ` SELECT  
   app_course_group.cg_id,
    app_course_group.cg_name
    FROM  
    app_course_cluster 
    INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
    INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
    WHERE  
    app_course_group.cg_id = ? AND 
    app_course_cluster.course_id = ? LIMIT 0,1`;
  let p = [cg_id, course_id, cs_id];
  const getNext = await runQuery(sql_next, [cg_id, course_id]);
  const getPrevious = await runQuery(sql_previous, [cg_id, course_id]);
  const getCurent = await runQuery(sql_curent, [cg_id, course_id]);

  const getCountAll = await runQuery(sql_count, p);
  const total = getCountAll[0] !== undefined ? getCountAll[0]?.numRows : 0;

  sql += `  ORDER BY app_course_lesson.cs_id ASC LIMIT 0,1 `;
  const getContent = await runQuery(sql, p);

  // ตรวจสอบว่ามี log หรือไม่
  const checkLog = await runQuery(
    "SELECT  *  FROM app_course_log  WHERE cs_id = ? AND  course_id=? AND  user_id=? ORDER BY cl_id DESC LIMIT 0 ,1",
    [cs_id, course_id, user_id]
  );
  const last_cl_id = checkLog[0] !== undefined ? checkLog[0]?.cl_id : 0;
  // const last_cs_id = checkLog[0] !== undefined ? checkLog[0]?.cs_id : 0;
  // บทเรียนที่แสดงข้อมูลอันดับแรก นำมาเก็บ log เพื่อเป็นประวัติเรียนล่าสุด
  const first_cs_id = getContent[0] !== undefined ? getContent[0].cs_id : 0;

  // ถ้ารหัสบทเรียนที่รับค่ามา ไม่มีในหมวดหมู่ ให้ไปหา บทเรียนแรกของหมวดหมู่เรียนนั้น
  let debug_data_curent_lesson = {};
  let debug_cs_id = 0;
  if (first_cs_id === 0) {
    const r = await runQuery(
      `
    SELECT 
    app_course_lesson.cs_id,
    app_course_lesson.cs_cover,
    app_course_lesson.cs_name,
    app_course_lesson.cs_video,
    app_course_lesson.cs_description,
    app_course_lesson.crt_date,
    app_course_lesson.udp_date,
    app_course_cluster.course_id,
    app_course_group.cg_id,
    app_course_group.cg_name
    FROM app_course_cluster 
    INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
    INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
    WHERE
    app_course_group.cg_id = ? AND 
    app_course_cluster.course_id = ? 
    ORDER BY app_course_cluster.cs_id ASC LIMIT 0,1 `,
      [cg_id, course_id]
    );
    debug_cs_id = r[0]?.cs_id !== undefined ? r[0]?.cs_id : 0;
    debug_data_curent_lesson = r[0] !== undefined ? r[0] : {};
    await runQuery(
      "INSERT INTO app_course_log (cs_id,course_id,user_id,udp_date) VALUES (?,?,?,?)",
      [debug_cs_id, course_id, user_id, functions.dateAsiaThai()]
    );
  }

  if (
    first_cs_id !== undefined &&
    first_cs_id !== "" &&
    first_cs_id !== 0 &&
    last_cl_id === 0
  ) {
    await runQuery(
      "INSERT INTO app_course_log (cs_id,course_id,user_id,udp_date) VALUES (?,?,?,?)",
      [first_cs_id, course_id, user_id, functions.dateAsiaThai()]
    );
  }
  // บทเรียนก่อนหน้านี้
  const getPreviousLesson = await runQuery(
    ` SELECT 
    app_course_lesson.cs_id,
    app_course_lesson.cs_cover,
    app_course_lesson.cs_name,
    app_course_lesson.cs_video,
    app_course_lesson.cs_description,
    app_course_lesson.crt_date,
    app_course_lesson.udp_date,
    app_course_cluster.course_id,
    app_course_group.cg_id,
    app_course_group.cg_name
    FROM app_course_cluster 
    INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
    INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
    WHERE
    app_course_group.cg_id = ? AND 
    app_course_cluster.course_id = ? AND
    app_course_cluster.cs_id < ? ORDER BY app_course_cluster.cs_id DESC LIMIT 0 ,1`,
    [cg_id, course_id, debug_cs_id !== 0 ? debug_cs_id : cs_id]
  );

  // บทเรียนถัดไป
  const getNextLesson = await runQuery(
    ` SELECT 
    app_course_lesson.cs_id,
    app_course_lesson.cs_cover,
    app_course_lesson.cs_name,
    app_course_lesson.cs_video,
    app_course_lesson.cs_description,
    app_course_lesson.crt_date,
    app_course_lesson.udp_date,
    app_course_cluster.course_id,
    app_course_group.cg_id,
    app_course_group.cg_name
    FROM app_course_cluster 
    INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
    INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
    WHERE
    app_course_group.cg_id = ? AND 
    app_course_cluster.course_id = ? AND
    app_course_cluster.cs_id > ? ORDER BY app_course_cluster.cs_id ASC LIMIT 0 ,1`,
    [cg_id, course_id, debug_cs_id !== 0 ? debug_cs_id : cs_id]
  );

  const check_learning = await runQuery(
    "SELECT COUNT(cs_id) AS total_learing FROM app_course_log WHERE cs_id = ? AND user_id = ? AND course_id = ?",
    [debug_cs_id !== 0 ? debug_cs_id : cs_id, user_id, course_id]
  );
  const lesson_course = await runQuery(
    "SELECT course_id ,course_cover,course_code,course_name,course_description,course_remark_a,course_remark_b FROM app_course WHERE course_id  = ? ",
    [course_id]
  );

  let learning_status = "false";
  const total_learing =
    check_learning[0]?.total_learing !== undefined
      ? check_learning[0]?.total_learing
      : 0;
  if (total_learing > 0) {
    learning_status = "true";
  }
  // console.log(getLastLesson);
  const response = {
    total_lesson: total,
    learning_status: learning_status,
    previous_couse_group: getPrevious[0] !== undefined ? getPrevious[0] : {},
    curent_couse_group: getCurent[0] !== undefined ? getCurent[0] : {},
    next_couse_group: getNext[0] !== undefined ? getNext[0] : {},
    previous_lesson:
      getPreviousLesson[0] !== undefined ? getPreviousLesson[0] : {},
    curent_lesson:
      getContent[0] !== undefined ? getContent[0] : debug_data_curent_lesson,
    next_lesson: getNextLesson[0] !== undefined ? getNextLesson[0] : {},
    course: lesson_course[0] !== undefined ? lesson_course[0] : {},
  };
  return res.json(response);
});

router.get("/lesson/get/:cs_id", middleware, (req, res, next) => {
  const { cs_id } = req.params;
  con.query(
    "SELECT * FROM app_course_lesson WHERE cs_id = ? AND cancelled = 1",
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
      };
      return res.json(response);
    }
  );
});
router.get("/learn/status?", middleware, async (req, res, next) => {
  const user_id = req.query.user_id;
  const course_id = req.query.course_id;

  const learned_content = await runQuery(
    "SELECT * FROM app_course_log WHERE user_id = ? AND course_id = ? GROUP BY cs_id ",
    [user_id, course_id]
  );
  const lesson_content = await runQuery(
    "SELECT * FROM app_course_cluster WHERE course_id = ? GROUP BY cs_id",
    [course_id]
  );
  const learned_last = await runQuery(
    "SELECT app_course_log.* ,app_course_lesson.cg_id FROM app_course_log  INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_log.cs_id WHERE app_course_log.user_id = ? AND app_course_log.course_id = ? ORDER BY app_course_log.cl_id DESC LIMIT 0,1 ",
    [user_id, course_id]
  );
  const cs_id =
    learned_last[0]?.cs_id !== undefined ? learned_last[0]?.cs_id : 0;
  const cg_id =
    learned_last[0]?.cg_id !== undefined ? learned_last[0]?.cg_id : 0;
  const lesson_content_plus = await runQuery(
    "SELECT cs_id ,cs_cover,cs_name,cs_video,cs_description FROM app_course_lesson WHERE cs_id  = ? ",
    [cs_id]
  );
  const lesson_course_group = await runQuery(
    "SELECT cg_id,cg_name FROM app_course_group WHERE cg_id  = ? ",
    [cg_id]
  );

  const lesson_course = await runQuery(
    "SELECT course_id ,course_cover,course_code,course_name,course_description,course_remark_a,course_remark_b FROM app_course WHERE course_id  = ? ",
    [course_id]
  );

  if (learned_content.length <= 0 || lesson_content.length <= 0) {
    return res.status(204).json({
      status: 204,
      message: "Data is null",
    });
  }
  const totalLesson =
    lesson_content?.length !== undefined ? lesson_content?.length : 0;
  const totalLearned =
    learned_content?.length !== undefined ? learned_content?.length : 0;
  const progress = (parseFloat(totalLearned) / parseFloat(totalLesson)) * 100;

  const response = {
    learning_status: progress >= 100 ? "true" : "false",
    learned: totalLearned,
    total_lesson: totalLesson,
    progress: progress.toFixed(2),
    last_date:
      learned_last[0]?.udp_date !== undefined ? learned_last[0]?.udp_date : "",
    last_lesson:
      lesson_content_plus[0] !== undefined ? lesson_content_plus[0] : {},
    last_course_group:
      lesson_course_group[0] !== undefined ? lesson_course_group[0] : {},
    last_course: lesson_course[0] !== undefined ? lesson_course[0] : {},
  };
  return res.json(response);
});

router.post("/learn/history/:user_id", middleware, async (req, res, next) => {
  const { user_id } = req.params;
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = functions.setZero((current_page - 1) * per_page);
  let p = [user_id];
  let search_param = [];
  let sql = `SELECT app_course.course_id,app_course.course_cover,app_course.course_code,app_course.course_name,app_course.course_description,app_course.course_remark_a,app_course.course_remark_b,app_course.is_complete,app_course.crt_date,app_course.udp_date
   FROM app_course_log INNER JOIN app_course ON app_course.course_id=app_course_log.course_id  WHERE app_course_log.user_id =? `;
  let sql_count =
    " SELECT  app_course_log.* FROM  app_course_log INNER JOIN app_course ON app_course.course_id=app_course_log.course_id WHERE  app_course_log.user_id =? ";

  sql_count_group = " GROUP BY  app_course_log.course_id ";
  let getCountAll = await runQuery(sql_count + sql_count_group, p);
  const total = getCountAll?.length !== undefined ? getCountAll?.length : 0;

  if (search !== "" || search.length > 0) {
    let q = ` AND (app_course.course_code  LIKE ? OR app_course.course_name  LIKE  ? OR app_course.course_description  LIKE  ? OR app_course.course_remark_a  LIKE  ? OR app_course.course_remark_b  LIKE  ?)`; //
    sql += q;
    sql_count += q;
    search_param = [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    ];
  }

  let getCountFilter = await runQuery(
    sql_count + sql_count_group,
    p.concat(search_param)
  );
  const total_filter =
    getCountFilter?.length !== undefined ? getCountFilter?.length : 0;

  sql += ` GROUP BY  app_course_log.course_id ORDER BY app_course_log.cl_id DESC LIMIT ${offset},${per_page} `;

  let getContent = await runQuery(sql, p.concat(search_param));

  let obj = [];
  for (let i = 0; i < getContent.length; i++) {
    let el = getContent[i];
    let learned_content = await runQuery(
      "SELECT * FROM app_course_log WHERE user_id = ? AND course_id = ? GROUP BY cs_id ",
      [user_id, el?.course_id]
    );
    let lesson_content = await runQuery(
      "SELECT * FROM app_course_cluster WHERE course_id = ? GROUP BY cs_id",
      [el?.course_id]
    );
    let totalLesson =
      lesson_content?.length !== undefined ? lesson_content?.length : 0;
    let totalLearned =
      learned_content?.length !== undefined ? learned_content?.length : 0;

    let progress = (parseFloat(totalLearned) / parseFloat(totalLesson)) * 100;

    let newObj = {
      learned: totalLearned,
      total_lesson: totalLesson,
      progress: progress.toFixed(2),
      last_date:
        learned_content[0]?.udp_date !== undefined
          ? learned_content[0]?.udp_date
          : "",
    };
    let data_merg = { ...el, ...newObj };
    obj.push(data_merg);
  }
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

router.post("/group/create", middleware, (req, res, next) => {
  const data = req.body;
  const user_id = data.user_id;

  con.query(
    "SELECT user_id FROM app_user WHERE user_id = ?",
    [user_id],
    (err, rows) => {
      let checkuser = rows?.length;
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Username Error", // error.sqlMessage
        });
      }

      con.query(
        "INSERT INTO app_course_group (cg_name,crt_date,udp_date,user_crt,user_udp) VALUES (?,?,?,?,?)",
        [
          data.cg_name,
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

router.put("/group/update/:cg_id", middleware, (req, res, next) => {
  const { cg_id } = req.params;
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
        "UPDATE  app_course_group SET cg_name=? ,udp_date=? , user_udp=? WHERE cg_id=? ",
        [data.cg_name, functions.dateAsiaThai(), user_id, cg_id],
        function (err, result) {
          if (err) throw err;

          return res.json(result);
        }
      );
    }
  );
});
router.delete("/group/delete/:cg_id", middleware, (req, res, next) => {
  const { cg_id } = req.params;
  con.query(
    "UPDATE  app_course_group SET cancelled = 0 WHERE cg_id=? ",
    [cg_id],
    function (err, result) {
      if (err) throw err;

      return res.json(result);
    }
  );
});

router.post("/group/all", middleware, async (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = functions.setZero((current_page - 1) * per_page);

  let search_param = [];
  let sql = `SELECT app_course_group.cg_id,app_course_group.cg_name,app_course_group.crt_date,app_course_group.udp_date ,
     CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update
     FROM app_course_group LEFT JOIN  app_user u1 ON u1.user_id = app_course_group.user_crt  LEFT JOIN  app_user u2 ON u2.user_id = app_course_group.user_udp WHERE app_course_group.cancelled=1`;
  let p = [];

  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_course_group WHERE  app_course_group.cancelled=1 ";

  const getCountAll = await runQuery(sql_count, p);
  const total = getCountAll[0] !== undefined ? getCountAll[0]?.numRows : 0;

  if (search !== "" || search.length > 0) {
    let q = ` AND (app_course_group.cg_name  LIKE ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`, `%${search}%`];
  }

  const getCountFilter = await runQuery(sql_count, p.concat(search_param));
  const total_filter =
    getCountFilter[0] !== undefined ? getCountFilter[0]?.numRows : 0;

  sql += `  ORDER BY app_course_group.cg_name ASC LIMIT ${offset},${per_page} `;
  const getContent = await runQuery(sql, p.concat(search_param));
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

router.post("/document/create", middleware, (req, res, next) => {
  const data = req.body;
  const course_id = data.course_id;

  con.query(
    "SELECT * FROM app_course WHERE course_id = ?",
    [course_id],
    (err, rows) => {
      let checkuser = rows.length;
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Document Error",
        });
      }

      con.query(
        "INSERT INTO app_course_document (cd_path,cd_name,course_id) VALUES (?,?,?)",
        [data.cd_path, data.cd_name, course_id],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.delete("/document/delete/:id", middleware, (req, res, next) => {
  const { id } = req.params;

  con.query(
    "SELECT * FROM app_course_document WHERE id = ?",
    [id],
    (err, rows) => {
      const check_content = rows.length;
      const path = rows[0]?.cd_path;
      if (check_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Document Error",
        });
      }

      con.query(
        "DELETE FROM app_course_document WHERE id = ? ",
        [id],
        function (err, result) {
          if (err) throw err;
          if (path !== undefined && path !== "") {
            delFile(path);
          }

          return res.json(result);
        }
      );
    }
  );
});

router.get("/document/get/:course_id", middleware, (req, res, next) => {
  const { course_id } = req.params;

  con.query(
    "SELECT * FROM app_course_document WHERE course_id = ?",
    [course_id],
    (err, result) => {
      return res.json(result);
    }
  );
});

router.post("/condition/create", middleware, async (req, res, next) => {
  const data = req.body;
  const cg_id = data.cg_id;
  const course_id = data.course_id;

  const getCourse = await runQuery(
    "SELECT  * FROM  app_course WHERE  course_id= ? ",
    [course_id]
  );
  const getCourseGroup = await runQuery(
    "SELECT  * FROM  app_course_group WHERE  cg_id= ? ",
    [cg_id]
  );
  const checkContent = await runQuery(
    "SELECT  COUNT(*) as numRows FROM  app_course_condition WHERE  cg_id= ? AND course_id=?",
    [cg_id, course_id]
  );
  const total_check =
    checkContent[0] !== undefined ? checkContent[0]?.numRows : 0;
  const check_course_id =
    getCourse[0] !== undefined ? getCourse[0]?.course_id : 0;
  const check_cg_id =
    getCourseGroup[0] !== undefined ? getCourseGroup[0]?.cg_id : 0;
  if (check_course_id === 0 || check_cg_id === 0) {
    return res.status(404).json({
      status: 404,
      message: "Invalid  Data",
    });
  }

  if (total_check > 0) {
    return res.status(404).json({
      status: 404,
      message:
        "Data already exists in the system. Unable to proceed with the transaction.",
    });
  }
  con.query(
    "INSERT INTO app_course_condition (cc_value_a,cc_value_b,cg_id,course_id) VALUES (?,?,?,?)",
    [data.cc_value_a, data.cc_value_b, cg_id, course_id],
    function (err, result) {
      if (err) throw err;
      return res.json(result);
    }
  );
});

router.put("/condition/update/:id", middleware, async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const cg_id = data.cg_id;
  const course_id = data.course_id;

  const checkMain = await runQuery(
    "SELECT  * FROM  app_course_condition WHERE  id= ? ",
    [id]
  );
  if (checkMain.length === 0 || checkMain === undefined) {
    return res.status(404).json({
      status: 404,
      message: "Invalid  Data",
    });
  }

  const getCourse = await runQuery(
    "SELECT  * FROM  app_course WHERE  app_course.course_id= ? ",
    [course_id]
  );
  const getCourseGroup = await runQuery(
    "SELECT  * FROM  app_course_group WHERE  app_course_group.cg_id= ? ",
    [cg_id]
  );
  const checkContent = await runQuery(
    "SELECT  COUNT(*) as numRows FROM  app_course_condition WHERE  cg_id= ? AND course_id=? AND id != ?",
    [cg_id, course_id, id]
  );
  const total_check =
    checkContent[0] !== undefined ? checkContent[0]?.numRows : 0;
  if (total_check > 0) {
    return res.status(404).json({
      status: 404,
      message:
        "Data already exists in the system. Unable to proceed with the transaction.",
    });
  }

  const check_course_id =
    getCourse[0] !== undefined ? getCourse[0]?.course_id : 0;
  const check_cg_id =
    getCourseGroup[0] !== undefined ? getCourseGroup[0]?.cg_id : 0;
  if (check_course_id === 0 && check_cg_id === 0) {
    return res.status(404).json({
      status: 404,
      message: "Invalid  Data",
    });
  }
  con.query(
    "UPDATE  app_course_condition SET cc_value_a=? ,cc_value_b=? , cg_id=? ,course_id=? WHERE id=?",
    [data.cc_value_a, data.cc_value_b, cg_id, course_id, id],
    function (err, result) {
      if (err) throw err;
      return res.json(result);
    }
  );
});

router.delete("/condition/delete/:id", middleware, (req, res, next) => {
  const { id } = req.params;

  con.query(
    "SELECT * FROM app_course_condition WHERE id = ?",
    [id],
    (err, rows) => {
      const check_content = rows.length;
      if (check_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }

      con.query(
        "DELETE FROM app_course_condition WHERE id = ? ",
        [id],
        function (err, result) {
          if (err) throw err;

          return res.json(result);
        }
      );
    }
  );
});

router.get("/condition/list/?", middleware, async (req, res, next) => {
  const course_id = req.query.course_id;

  const checkContent = await runQuery(
    "SELECT  SUM(cc_value_a) AS sum_val_a , SUM(cc_value_b) AS sum_val_b FROM  app_course_condition WHERE  course_id=?",
    [course_id]
  );
  const content = await runQuery(
    "SELECT  app_course_condition.*, app_course_group.cg_name FROM  app_course_condition  INNER JOIN  app_course_group ON app_course_group.cg_id =app_course_condition.cg_id  WHERE   app_course_condition.course_id=? ORDER BY id ASC",
    [course_id]
  );
  const sum_val_a =
    checkContent[0] !== undefined ? checkContent[0]?.sum_val_a : 0;
  const sum_val_b =
    checkContent[0] !== undefined ? checkContent[0]?.sum_val_b : 0;
  const response = {
    sum_val_a: sum_val_a,
    sum_val_b: sum_val_b,
    data: content,
  };
  return res.json(response);
});

module.exports = router;
