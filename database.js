const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  port: "3306",
  password: "",
  database: "oas",
  // timezone: "Asia/Bangkok",
  timezone: "+00:00",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports = connection;
