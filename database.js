const mysql = require("mysql2");
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   port: "3306",
//   password: "",
//   database: "oas",
// });

// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  port: "3306",
  password: "@P@SS.W0rd",
  database: "oas",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports = connection;
