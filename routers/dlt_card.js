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
  const obj = common.drivinglicense_type;
  const result_filter = obj.filter(function (e) {
    return e.dlt_code === dlt_code;
  });
  let _check_dlt_cadrd = 0;
  con.query(
    " SELECT id FROM app_dlt_card WHERE dlt_code = ? AND user_id=? LIMIT 1",
    [dlt_code, user_id],
    function (err, result) {
      if (err) throw err;
      _check_dlt_cadrd = result.length;
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
      if (_check_dlt_cadrd >= 1) {
        return res.status(404).json({
          status: 404,
          message:
            "You have entered an dlt_code and user_id that already exists in this column. Only unique dlt_code and user_id are allowed.",
        });
      }

      con.query(
        "INSERT INTO app_dlt_card (front_img,back_img,dlt_code,crt_date,udp_date,user_id) VALUES (?,?,?,?,?,?)",
        [
          data.front_img,
          data.back_img,
          dlt_code,
          localISOTime,
          localISOTime,
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

router.put("/update/:id", middleware, (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const user_id = data.user_id;
  const dlt_code = data.dlt_code;
  const obj = common.drivinglicense_type;
  const result_filter = obj.filter(function (e) {
    return e.dlt_code === dlt_code;
  });
  let _check_dlt_cadrd = 0;
  con.query(
    " SELECT id FROM app_dlt_card WHERE dlt_code = ? AND user_id=? AND id !=? LIMIT 1",
    [dlt_code, user_id, id],
    function (err, result) {
      if (err) throw err;
      _check_dlt_cadrd = result.length;
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
      if (_check_dlt_cadrd >= 1) {
        return res.status(404).json({
          status: 404,
          message:
            "You have entered an dlt_code and user_id that already exists in this column. Only unique dlt_code and user_id are allowed.",
        });
      }
      con.query(
        "UPDATE  app_dlt_card SET front_img=?,back_img=?,dlt_code=?,udp_date=? WHERE id=?",
        [data.front_img, data.back_img, dlt_code, localISOTime, id],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.delete("/delete/:id", middleware, (req, res, next) => {
  const { id } = req.params;
  con.query(
    "SELECT id  FROM app_dlt_card WHERE id  = ? LIMIT 1",
    [id],
    (err, rows) => {
      let _content = rows.length;

      if (_content <= 0) {
        return res.status(204).json({
          status: 204,
          message: "Data is null",
        });
      }
      con.query(
        "   DELETE FROM  app_dlt_card WHERE id=? ",
        [id],
        function (err, result) {
          if (err) throw err;
          return res.json(result);
        }
      );
    }
  );
});

router.get("/list?", middleware, (req, res, next) => {
  const user_id = req.query.user_id;
  //   console.log(user_id);
  con.query(
    " SELECT  *  FROM app_dlt_card WHERE user_id  = ? ORDER BY id ASC ",
    [user_id],
    (err, rows) => {
      return res.json(rows);
    }
  );
});

module.exports = router;
