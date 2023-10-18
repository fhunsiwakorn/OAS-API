const express = require("express");
const router = express.Router();
const con = require("../database");
const middleware = require("../middleware");

async function runQuery(sql, param) {
  return new Promise((resolve, reject) => {
    resolve(con.query(sql, param));
  });
}

router.post("/register", middleware, async (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page <= 50 ? data.per_page : 50;
  const search = data.search;
  const offset = (current_page - 1) * per_page;

  const start_date = data.start_date;
  const end_date = data.end_date;

  let total = 0;
  let total_filter = 0;
  let search_param = [];
  let join_date = [start_date, end_date];

  let sql = `SELECT 
  t1.user_id ,
  t1.user_name,
  t1.user_firstname,
  t1.user_lastname,
  t1.user_email,
  t1.user_phone,
  t1.user_type,
  t1.crt_date,
  t1.udp_date,
  t2.verify_account,
  t2.identification_number,
  t2.user_img
  FROM app_user t1 
  INNER JOIN app_user_detail t2 ON  t2.user_id = t1.user_id 
  WHERE 
  t1.cancelled =1 AND t1.user_type=3 AND DATE(t1.crt_date) >= ? AND DATE(t1.crt_date) <= ? `;
  let sql_count =
    " SELECT  COUNT(t1.user_id) as numRows FROM  app_user t1  INNER JOIN app_user_detail t2 ON  t2.user_id = t1.user_id WHERE  t1.cancelled=1 AND t1.user_type=3 AND DATE(t1.crt_date) >= ? AND DATE(t1.crt_date) <= ?";

  let getCountAll = await runQuery(sql_count, join_date.concat(search_param));
  total = getCountAll[0] !== undefined ? getCountAll[0]?.numRows : 0;

  if (search !== "" || search.length > 0) {
    let q = ` AND (t1.user_firstname  LIKE ? OR t1.user_lastname  LIKE  ? OR t1.user_email  LIKE  ? OR t2.identification_number  LIKE  ?) `; //
    sql += q;
    sql_count += q;
    search_param = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
  }

  let getCountFilter = await runQuery(
    sql_count,
    join_date.concat(search_param)
  );
  total_filter =
    getCountFilter[0] !== undefined ? getCountFilter[0]?.numRows : 0;
  sql += `  ORDER BY t1.user_id DESC LIMIT ${offset},${per_page} `;

  let getContent = await runQuery(sql, join_date);
  const response = {
    total: total, // จำนวนรายการทั้งหมด
    total_filter: total_filter, // จำนวนรายการทั้งหมด
    current_page: current_page, // หน้าที่กำลังแสดงอยู่
    limit_page: per_page, // limit data
    total_page: Math.ceil(total / per_page), // จำนวนหน้าทั้งหมด
    search: search, // คำค้นหา
    data: getContent, // รายการข้อมูล
  };
  return res.json(response);
});

module.exports = router;
