const express = require("express");
const bcrypt = require("bcrypt");
const request = require("request");
const router = express.Router();
const con = require("../database");
const common = require("../common");
const middleware = require("../middleware");
const functions = require("../functions");
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
  let u = "";
  let sql =
    "SELECT 	user_id,  user_name,  user_firstname,  user_lastname, user_email, user_phone, user_type, crt_date, udp_date  FROM app_user WHERE cancelled=1";

  if (req.query.user_type) {
    let user_type = req.query.user_type;
    u = " AND user_type =  " + user_type; // ประเภท User
    sql += u;
  }
  let sql_count =
    " SELECT  COUNT(*) as numRows FROM  app_user WHERE  cancelled=1 ";
  con.query(sql_count + u, (err, results) => {
    let res = results[0];
    total = res !== undefined ? res?.numRows : 0;
  });

  if (search !== "" || search.length > 0) {
    // sql += ` AND (user_name  LIKE  '%${search}%' OR user_firstname  LIKE  '%${search}%' OR user_lastname  LIKE  '%${search}%' OR user_email  LIKE  '%${search}%' OR user_phone  LIKE  '%${search}%')`; //
    let q = ` AND (user_name  LIKE ? OR user_firstname  LIKE  ? OR user_lastname  LIKE  ? OR user_email  LIKE  ? OR user_phone  LIKE  ?)`; //
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

  con.query(sql_count + u, search_param, (err, rows) => {
    let res = rows[0];
    total_filter = res !== undefined ? res?.numRows : 0;
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
    "SELECT * FROM app_user WHERE active = 1 AND cancelled=1 AND (user_name = ? OR user_email=? OR user_phone=?) LIMIT 1",
    [data.user_name, data.user_name, data.user_name],
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
  let user_phone = data.user_phone;
  let user_email = data.user_email;
  let checkuser = 0;

  con.query(
    "SELECT user_name FROM app_user WHERE user_name = ? OR user_email=? OR user_phone=? LIMIT 1",
    [user_name, user_email, user_phone],
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
        "INSERT INTO app_user (user_name, user_password,user_firstname,user_lastname,user_email,user_phone,user_type,active,crt_date,udp_date) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
          user_name,
          userHash,
          data.user_firstname,
          data.user_lastname,
          user_email,
          user_phone,
          data.user_type,
          data.active,
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
  let user_phone = data.user_phone;
  let user_email = data.user_email;
  con.query(
    "SELECT user_id FROM app_user WHERE user_id = ? LIMIT 1",
    [user_id],
    (err, rs) => {
      if (rs.length <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Username Error", // error.sqlMessage
        });
      }

      con.query(
        "SELECT user_name FROM app_user WHERE (user_name = ? OR user_email=? OR user_phone=?) AND user_id != ? LIMIT 1",
        [user_name, user_email, user_phone, user_id],
        (err, rows) => {
          bcrypt
            .hash(data.user_password, numSaltRounds)
            .then((hash) => {
              // console.log(checkuser);
              if (rows.length >= 1) {
                return res.status(204).json({
                  status: 204,
                  message: "Username Error", // error.sqlMessage
                });
              }
              let userHash = hash;
              con.query(
                "UPDATE  app_user SET user_name=? , user_password=? ,user_firstname=? ,user_lastname=? ,user_email=? ,user_phone=? ,user_type=?,active=?, udp_date=? WHERE user_id=? ",
                [
                  user_name,
                  userHash,
                  data.user_firstname,
                  data.user_lastname,
                  user_email,
                  user_phone,
                  data.user_type,
                  data.active,
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
        }
      );
    }
  );
});

router.get("/get/:user_id", middleware, (req, res, next) => {
  const { user_id } = req.params;
  let sql = `SELECT 
  t1.* ,
  (SELECT  GROUP_CONCAT((JSON_OBJECT('verify_account', t2.verify_account,'identification_number', t2.identification_number,'user_img', t2.user_img,'user_birthday', t2.user_birthday,'user_address', t2.user_address,'location_id', t2.location_id,'country_id',t2.country_id,
  'location', (SELECT   GROUP_CONCAT((JSON_OBJECT('zipcode', t3.zipcode,'zipcode_name', t3.zipcode_name , 'province_code', t3.province_code,'province_name', t3.province_name)))  FROM app_zipcode_lao t3  WHERE t3.id =  t2.location_id),
  'country', (SELECT   GROUP_CONCAT((JSON_OBJECT('country_name_eng', t4.country_name_eng,'country_official_name_eng', t4.country_official_name_eng , 'capital_name_eng', t4.capital_name_eng,'zone', t4.zone)))  FROM app_country t4  WHERE t4.country_id =  t2.country_id)

  )))  FROM app_user_detail t2  WHERE t2.user_id =  t1.user_id ) AS detail
  FROM app_user t1 
  WHERE  t1.user_id = ? LIMIT 1
  `;
  con.query(sql, [user_id], function (err, results) {
    if (results.length <= 0) {
      return res.status(204).json({
        status: 204,
        message: "Data is null", // error.sqlMessage
      });
    }
    let data = results[0];
    let detail = data?.detail !== undefined ? JSON.parse(data?.detail) : {};
    let set_detail = {};
    if (detail != undefined) {
      let location = JSON.parse(detail?.location);
      let country = JSON.parse(detail?.country);
      set_detail = {
        verify_account: detail?.verify_account,
        identification_number: detail?.identification_number,
        user_img: detail?.user_img,
        user_birthday: detail?.user_birthday,
        user_address: detail?.user_address,
        location_id: detail?.location_id,
        country_id: detail?.country_id,
        location: location,
        country: country,
      };
    }
    const response = {
      user_id: data?.user_id,
      user_name: data?.user_name,
      user_firstname: data?.user_firstname,
      user_lastname: data?.user_lastname,
      user_email: data?.user_email,
      user_phone: data?.user_phone,
      user_type: data?.user_type,
      active: data?.active,
      crt_date: data?.crt_date,
      udp_date: data?.udp_date,
      detail: set_detail,
    };
    return res.json(response);
  });
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

router.post("/detail/create", middleware, (req, res, next) => {
  const data = req.body;
  let user_id = data.user_id;
  let location_id = data.location_id;
  let country_id = data.country_id;
  let verify_account = data.verify_account;
  let identification_number = data.identification_number;
  let total_zipcode = 0;
  let total_country = 0;
  let check_identification = 0;
  con.query(
    "SELECT id FROM app_zipcode_lao WHERE id = ? LIMIT 1",
    [location_id],
    (err, rows) => {
      total_zipcode = rows?.length;
    }
  );
  con.query(
    "SELECT country_id FROM app_country WHERE country_id = ? LIMIT 1",
    [country_id],
    (err, rows) => {
      total_country = rows?.length;
    }
  );

  con.query(
    "SELECT identification_number FROM app_user_detail WHERE identification_number = ? AND user_id !=? LIMIT 1",
    [identification_number, user_id],
    (err, rows) => {
      check_identification = rows?.length;
    }
  );

  con.query(
    "SELECT app_user.user_name ,app_user_detail.id FROM app_user LEFT JOIN app_user_detail ON app_user_detail.user_id  = app_user.user_id  WHERE app_user.user_id = ? GROUP BY app_user.user_id",
    [user_id],
    (err, rows) => {
      if (rows.length <= 0 || total_zipcode <= 0 || total_country <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null", // error.sqlMessage
        });
      }
      if (verify_account !== "n" && verify_account !== "y") {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'verify_account' ", // error.sqlMessage
        });
      }
      if (check_identification >= 1) {
        return res.status(404).json({
          status: 404,
          message: "Invalid 'identification_number' ", // error.sqlMessage
        });
      }

      let id_detail = rows[0]?.id;

      if (id_detail === null || id_detail === 0) {
        con.query(
          "INSERT INTO app_user_detail (verify_account,identification_number,user_img, user_birthday,user_address,location_id,country_id,user_id) VALUES (?,?,?,?,?,?,?,?)",
          [
            verify_account,
            identification_number,
            data.user_img,
            data.user_birthday,
            data.user_address,
            location_id,
            country_id,
            data.user_id,
          ],
          function (err, result) {
            if (err) throw err;
            return res.json(result);
          }
        );
      } else {
        con.query(
          "UPDATE  app_user_detail SET verify_account=?,identification_number=?, user_img=? , user_birthday=? ,user_address=? ,location_id=? ,country_id=?  WHERE user_id=? ",
          [
            verify_account,
            identification_number,
            data.user_img,
            data.user_birthday,
            data.user_address,
            location_id,
            country_id,
            data.user_id,
          ],
          function (err, result) {
            if (err) throw err;
            // console.log("1 record inserted");
            return res.json(result);
          }
        );
      }
    }
  );
});

router.get("/otp/:user_id", middleware, (req, res, next) => {
  const { user_id } = req.params;
  const otp_code = Math.floor(100000 + Math.random() * 900000);
  const otp_ref = functions.randomCode();

  con.query(
    "SELECT app_user.user_name ,app_user.user_phone,app_user_otp.total_request FROM app_user LEFT JOIN app_user_otp ON app_user_otp.user_id  = app_user.user_id  WHERE app_user.user_id = ? GROUP BY app_user.user_id",
    [user_id],
    (err, rows) => {
      if (rows.length <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null", // error.sqlMessage
        });
      }
      let user_phone =
        rows[0]?.user_phone === undefined ? 0 : rows[0]?.user_phone;
      console.log(user_phone);
      let total_request =
        rows[0]?.total_request === undefined ? 0 : rows[0]?.total_request;
      let total_request_set = total_request + 1;
      if (total_request === null) {
        con.query(
          "INSERT INTO app_user_otp (otp_code,otp_ref,total_request, crt_date,udp_date,user_id) VALUES (?,?,?,?,?,?)",
          [otp_code, otp_ref, 1, localISOTime, localISOTime, user_id]
        );
      } else {
        con.query(
          "UPDATE  app_user_otp SET otp_code=?,otp_ref=?, total_request=? , udp_date=?  WHERE user_id=? ",
          [otp_code, otp_ref, total_request_set, localISOTime, user_id]
        );
      }
      // SMS API
      data = {
        sender: "SMS PRO",
        msisdn: [user_phone],
        message: "Your OTP is " + otp_code + " REF:" + otp_ref,
      };
      // request(
      //   {
      //     method: "POST",
      //     body: data,
      //     json: true,
      //     url: "https://thsms.com/api/send-sms",
      //     headers: {
      //       Authorization: common.sms_token,
      //     },
      //   },
      //   function (error, response, body) {
      //     console.log(body);
      //   }
      // );
      return res.json({
        otp_code: otp_code,
        otp_ref: otp_ref,
        total_request: total_request_set,
      });
    }
  );
});

router.put("/verify_otp", middleware, (req, res, next) => {
  const data = req.body;
  let otp_code = data.otp_code;
  let user_id = data.user_id;
  con.query(
    "SELECT user_id,  otp_code  FROM app_user_otp WHERE  user_id = ? AND otp_code=? LIMIT 1",
    [user_id, otp_code],
    function (err, results) {
      if (results.length <= 0) {
        return res.status(204).json({
          access: false,
        });
      }
      return res.json({ access: true });
    }
  );
});

module.exports = router;
