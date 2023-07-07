const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  return res.json({
    project_name: "Online Application System : OAS (สปป. ลาว)",
    deverlopment: "Siwakorn Banluesapy",
  });
});

module.exports = router;
