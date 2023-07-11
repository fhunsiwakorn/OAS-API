const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const con = require("../database");
const middleware = require("../middleware");
const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
const numSaltRounds = 8;

router.post("/list?", middleware, (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = (current_page - 1) * per_page;
  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let sql =
    "SELECT 	user_id,  user_name,  user_firstname,  user_lastname, user_email, user_phone, user_type, crt_date, udp_date  FROM app_user WHERE cancelled=1";
  if (req.query.user_type) {
    //
    let user_type = req.query.user_type;
    sql += " AND user_type =  " + user_type; // ประเภท User
  }

  con.query(sql, (err, results) => {
    total = results.length;
  });

  if (search !== "" || search.length > 0) {
    // sql += ` AND (user_name  LIKE  '%${search}%' OR user_firstname  LIKE  '%${search}%' OR user_lastname  LIKE  '%${search}%' OR user_email  LIKE  '%${search}%' OR user_phone  LIKE  '%${search}%')`; //
    sql += ` AND (user_name  LIKE ? OR user_firstname  LIKE  ? OR user_lastname  LIKE  ? OR user_email  LIKE  ? OR user_phone  LIKE  ?)`; //
    search_param = [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    ];
  }

  con.query(sql, search_param, (err, rows) => {
    total_filter = rows.length;
  });

  sql += `  ORDER BY user_id DESC LIMIT ${offset},${per_page} `;
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

router.post("/login", middleware, (req, res, next) => {
  const data = req.body;
  con.query(
    "SELECT * FROM app_user WHERE user_name = ? LIMIT 1",
    [data.user_name],
    function (err, response) {
      bcrypt
        .compare(data.user_password, response[0]?.user_password)
        .then((result) => {
          if (result === true) {
            return res.json(response[0]);
          } else {
            return res.status(204).json({
              status: 204,
              message:
                "Invalid Credentials Error With Correct Username/Password", // error.sqlMessage
            });
          }
        })
        .catch((err) => {
          //   console.log(err);
          return res.status(400).json({
            status: 400,
            message: "Invalid Credentials Error With Correct Username/Password", // error.sqlMessage
          });
        });
    }
  );
});

router.post("/create", middleware, (req, res, next) => {
  const data = req.body;
  let user_name = data.user_name;
  let checkuser;

  con.query(
    "SELECT user_name FROM app_user WHERE user_name = ? LIMIT 1",
    [user_name],
    (err, rows) => {
      checkuser = rows.length;
    }
  );

  bcrypt
    .hash(data.user_password, numSaltRounds)
    .then((hash) => {
      if (checkuser >= 1) {
        return res.status(204).json({
          status: 204,
          message: "Username Error", // error.sqlMessage
        });
      }

      let userHash = hash;
      // console.log("Hash ", hash);
      con.query(
        "INSERT INTO app_user (user_name, user_password,user_firstname,user_lastname,user_email,user_phone,user_type,crt_date,udp_date) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          user_name,
          userHash,
          data.user_firstname,
          data.user_lastname,
          data.user_email,
          data.user_phone,
          data.user_type,
          localISOTime,
          localISOTime,
        ],
        function (err, result) {
          if (err) throw err;
          // console.log("1 record inserted");
          return res.json(result);
        }
      );
    })
    .catch((err) => console.error(err.message));
});
router.put("/update/:user_id", middleware, (req, res, next) => {
  const { user_id } = req.params;
  const data = req.body;
  let user_name = data.user_name;
  let checkuser;
  con.query(
    "SELECT user_name FROM app_user WHERE user_name = ? AND user_id != ? LIMIT 1",
    [user_name, user_id],
    (err, rows) => {
      checkuser = rows.length;
    }
  );

  bcrypt
    .hash(data.user_password, numSaltRounds)
    .then((hash) => {
      // console.log(checkuser);
      if (checkuser) {
        return res.status(204).json({
          status: 204,
          message: "Username Error", // error.sqlMessage
        });
      }
      let userHash = hash;
      con.query(
        "UPDATE  app_user SET user_name=? , user_password=? ,user_firstname=? ,user_lastname=? ,user_email=? ,user_phone=? ,user_type=?,udp_date=? WHERE user_id=? ",
        [
          data.user_name,
          userHash,
          data.user_firstname,
          data.user_lastname,
          data.user_email,
          data.user_phone,
          data.user_type,
          localISOTime,
          user_id,
        ],
        function (err, result) {
          if (err) throw err;
          // console.log("1 record inserted");
          return res.json(result);
        }
      );
    })
    .catch((err) => console.error(err.message));
});

router.get("/get/:user_id", middleware, (req, res, next) => {
  const { user_id } = req.params;

  con.query(
    "SELECT user_id,  user_name,  user_firstname,  user_lastname, user_email, user_phone, user_type, crt_date, udp_date  FROM app_user WHERE  user_id = ? LIMIT 1",
    [user_id],
    function (err, results) {
      if (results.length <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null", // error.sqlMessage
        });
      }

      return res.json(results[0]);
    }
  );
});

router.delete("/delete/:user_id", middleware, (req, res, next) => {
  const { user_id } = req.params;
  con.query(
    "UPDATE  app_user SET cancelled=0  WHERE user_id = ?",
    [user_id],
    function (err, results) {
      return res.json(results);
    }
  );
});

module.exports = router;
