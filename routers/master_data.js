const express = require("express");
const router = express.Router();
const con = require("../database");
const middleware = require("../middleware");

router.post("/zipcode", middleware, (req, res, next) => {
  const data = req.body;
  const current_page = data.page;
  const per_page = data.per_page;
  const search = data.search;
  const offset = (current_page - 1) * per_page;
  let total = 0;
  let total_filter = 0;
  let search_param = [];

  let sql = "SELECT * FROM app_zipcode_lao";
  con.query(sql, (err, results) => {
    total = results.length;
  });

  if (search !== "" || search.length > 0) {
    sql += ` WHERE zipcode  LIKE ? OR zipcode_name  LIKE  ? OR amphur_name  LIKE  ? OR province_name  LIKE  ? `; //
    search_param = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
  }

  con.query(sql, search_param, (err, rows) => {
    total_filter = rows.length;
  });

  sql += ` LIMIT ${offset},${per_page} `;
  // query ข้อมูล
  con.query(sql, search_param, (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request", // error.sqlMessage
      });
    }

    const result = {
      status: 200,
      total: total, // จำนวนรายการทั้งหมด
      total_filter: total_filter, // จำนวนรายการทั้งหมด
      current_page: current_page, // หน้าที่กำลังแสดงอยู่
      total_page: Math.ceil(total_filter / per_page), // จำนวนหน้าทั้งหมด
      search: search, // คำค้นหา
      data: results, // รายการข้อมูล
    };
    return res.json(result);
  });
});
module.exports = router;
