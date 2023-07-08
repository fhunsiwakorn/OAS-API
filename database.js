const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: "3306",
  password: "",
  database: "oas",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock", //for mac and linux
});

connection.connect(function (err) {
  // if (err) throw err;
  console.log("Connected!");
});
module.exports = connection;
