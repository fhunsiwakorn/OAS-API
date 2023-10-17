const express = require("express");
const router = express.Router();
const request = require("request");
const con = require("../database");
const middleware = require("../middleware");
const functions = require("../functions");
const common = require("../common");
const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);

router.post("/sms/laotel/send", middleware, (req, res, next) => {
  const data = req.body;
  //   const transaction_id = data.transaction_id;
  const header = data.header;
  const phoneNumber = data.phoneNumber;
  const message = data.message;
  // SMS API
  let post = {
    transaction_id: functions.randomCode(),
    header: header,
    phoneNumber: phoneNumber,
    message: message,
  };

  request(
    {
      method: "POST",
      body: post,
      json: true,
      url: "https://ltcapi-uat.laotel.com:9443/api/sms_center/submit_sms",
      headers: {
        Apikey: "1JMr6JLXfRonSIhmPLjYGHcTj0rAwPgK",
        "Content-Type": "application/json",
      },
    },
    function (error, response, body) {
      console.log(body);
    }
  );
  return res.json({ msg: "success" });
});

module.exports = router;
