const express = require("express");
const router = express.Router();
const con = require("../database");
const middleware = require("../middleware");
const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);

router.post("/create", middleware, (req, res, next) => {
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
        "INSERT INTO app_news (news_cover,news_title,news_description,news_type,crt_date,udp_date,user_crt,user_udp) VALUES (?,?,?,?,?,?,?,?)",
        [
          data.news_cover,
          data.news_title,
          data.news_description,
          data.news_type,
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

router.put("/update/:news_id", middleware, (req, res, next) => {
  const { news_id } = req.params;
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
        "UPDATE  app_news SET news_cover=? , news_title=? ,news_description=? ,news_type=?,udp_date=? , user_udp=? WHERE news_id=? ",
        [
          data.news_cover,
          data.news_title,
          data.news_description,
          data.news_type,
          localISOTime,
          user_id,
          news_id,
        ],
        function (err, result) {
          if (err) throw err;
          // console.log("1 record inserted");
          return res.json(result);
        }
      );
    }
  );
});

router.get("/get/:news_id", middleware, (req, res, next) => {
  const { news_id } = req.params;
  let sql = `SELECT app_news.news_id,app_news.news_cover,app_news.news_title,app_news.news_description,app_news.news_type,app_news.crt_date,app_news.udp_date ,
  CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update
  FROM app_news LEFT JOIN  app_user u1 ON u1.user_id = app_news.user_crt  LEFT JOIN  app_user u2 ON u2.user_id = app_news.user_udp WHERE app_news.cancelled=1 AND app_news.news_id=?`;
  con.query(sql, [news_id], function (err, results) {
    if (results.length <= 0) {
      return res.status(204).json({
        status: 204,
        message: "Data is null", // error.sqlMessage
      });
    }

    return res.json(results[0]);
  });
});

router.delete("/delete/:news_id", middleware, (req, res, next) => {
  const { news_id } = req.params;
  con.query(
    "SELECT news_id FROM app_news WHERE news_id = ? LIMIT 1",
    [news_id],
    (err, rows) => {
      let _content = rows.length;

      if (_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }

      con.query(
        "UPDATE  app_news SET cancelled=0 WHERE news_id=? ",
        [news_id],
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
  let sql = `SELECT app_news.news_id,app_news.news_cover,app_news.news_title,app_news.news_description,app_news.news_type,app_news.crt_date,app_news.udp_date ,
  CONCAT(u1.user_firstname ,' ' , u1.user_lastname) AS user_create , CONCAT(u2.user_firstname ,' ' , u2.user_lastname) AS user_update
  FROM app_news LEFT JOIN  app_user u1 ON u1.user_id = app_news.user_crt  LEFT JOIN  app_user u2 ON u2.user_id = app_news.user_udp WHERE app_news.cancelled=1`;

  con.query(sql, (err, results) => {
    total = results.length;
  });

  if (search !== "" || search.length > 0) {
    sql += ` AND (news_title  LIKE ? OR news_description  LIKE  ?)`; //
    search_param = [`%${search}%`, `%${search}%`];
  }

  con.query(sql, search_param, (err, rows) => {
    total_filter = rows.length;
  });

  sql += `  ORDER BY news_id DESC LIMIT ${offset},${per_page} `;

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

router.post("/image/create", middleware, (req, res, next) => {
  const data = req.body;
  const news_id = data.news_id;
  con.query(
    "SELECT news_id FROM app_news WHERE news_id = ? LIMIT 1",
    [news_id],
    (err, rows) => {
      let _content = rows.length;

      if (_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }

      con.query(
        "INSERT INTO app_news_image (ni_path_file,ni_name_file,news_id) VALUES (?,?,?)",
        [data.ni_path_file, data.ni_name_file, news_id],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.delete("/image/delete/:ni_id", middleware, (req, res, next) => {
  const { ni_id } = req.params;
  con.query(
    "DELETE FROM  app_news_image WHERE ni_id=? ",
    [ni_id],
    function (err, result) {
      if (err) throw err;
      return res.json(result);
    }
  );
});

module.exports = router;
