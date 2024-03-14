const express = require("express");
const router = express.Router();
const con = require("../database");
const middleware = require("../middleware");
const functions = require("../functions");

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
        "UPDATE  app_course SET course_cover=? , course_code=? ,course_name=? ,course_description=?,udp_date=? , user_udp=? WHERE course_id=? ",
        [
          data.course_cover,
          data.course_code,
          data.course_name,
          data.course_description,
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
  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let sql = `SELECT app_course.course_id,app_course.course_cover,app_course.course_code,app_course.course_name,app_course.course_description,app_course.is_complete,app_course.crt_date,app_course.udp_date ,
   CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update
   FROM app_course LEFT JOIN  app_user u1 ON u1.user_id = app_course.user_crt  LEFT JOIN  app_user u2 ON u2.user_id = app_course.user_udp WHERE app_course.cancelled=1`;

  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_course WHERE  cancelled=1 ";

  let getCountAll = await runQuery(sql_count);
  total = getCountAll[0] !== undefined ? getCountAll[0]?.numRows : 0;

  if (search !== "" || search.length > 0) {
    let q = ` AND (app_course.course_code  LIKE ? OR app_course.course_name  LIKE  ? OR app_course.course_description  LIKE  ?)`; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`, `%${search}%`, `%${search}%`];
  }

  let getCountFilter = await runQuery(sql_count, search_param);
  total_filter =
    getCountFilter[0] !== undefined ? getCountFilter[0]?.numRows : 0;

  sql += `  ORDER BY app_course.course_id DESC LIMIT ${offset},${per_page} `;

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

router.post("/lesson/list/options/q", middleware, async (req, res, next) => {
  const course_id = req.query.course_id;
  const cg_id = req.query.cg_id;
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = functions.setZero((current_page - 1) * per_page);
  let search_param = [];
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
  app_course_cluster.course_id = ?
   `;
  let sql_count = ` SELECT  COUNT(*) as numRows 
   FROM  
   app_course_cluster 
   INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
   INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
   WHERE  
   app_course_group.cg_id = ? AND 
   app_course_cluster.course_id = ?`;

  let sql_next = ` SELECT  
   app_course_lesson.cg_id
   FROM  
   app_course_cluster 
   INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
   INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
   WHERE  
   app_course_group.cg_id > ? AND 
   app_course_cluster.course_id = ?`;
  let sql_previous = ` SELECT  
   app_course_lesson.cg_id
   FROM  
   app_course_cluster 
   INNER JOIN app_course_lesson ON app_course_lesson.cs_id = app_course_cluster.cs_id
   INNER JOIN app_course_group ON app_course_group.cg_id = app_course_lesson.cg_id
   WHERE  
   app_course_group.cg_id < ? AND 
   app_course_cluster.course_id = ?`;
  let p = [cg_id, course_id];
  const getNext = await runQuery(sql_next, p);
  const getPrevious = await runQuery(sql_previous, p);

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
  sql += `  ORDER BY app_course_lesson.cs_name DESC LIMIT ${offset},${per_page} `;
  const getContent = await runQuery(sql, p.concat(search_param));
  const response = {
    total: total, // จำนวนรายการทั้งหมด
    total_filter: total_filter, // จำนวนรายการทั้งหมด
    current_page: current_page, // หน้าที่กำลังแสดงอยู่
    limit_page: per_page, // limit data
    total_page: Math.ceil(total_filter / per_page), // จำนวนหน้าทั้งหมด
    search: search, // คำค้นหา
    next_cg_id: getNext[0] !== undefined ? getNext[0]?.cg_id : {},
    previous_cg_id: getPrevious[0] !== undefined ? getPrevious[0]?.cg_id : {},
    data: getContent, // รายการข้อมูล
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
router.get("/learn/status?", middleware, (req, res, next) => {
  const cs_id = req.query.cs_id;
  const user_id = req.query.user_id;
  const course_id = req.query.course_id;
  con.query(
    " SELECT COUNT(cs_id) AS total_learing FROM app_course_log WHERE cs_id = ? AND user_id = ? AND course_id = ?",
    [cs_id, user_id, course_id],
    (err, rs) => {
      const total = rs[0]?.total_learing;
      if (total >= 1) {
        return res.json({ studied: true });
      } else {
        return res.json({ studied: false });
      }
    }
  );
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
          message: "Course Error",
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

router.post("/document/delete/:id", middleware, (req, res, next) => {
  const data = req.body;
  const { id } = req.params;

  con.query(
    "SELECT user_id FROM app_course WHERE course_id = ?",
    [course_id],
    (err, rows) => {
      let checkuser = rows.length;
      if (checkuser <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Course Error",
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

module.exports = router;
