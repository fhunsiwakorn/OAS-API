const express = require("express");
const app = express();
const cors = require("cors");
const home = require("./routers/home");
const users = require("./routers/user");
const news = require("./routers/news");
const course = require("./routers/course");
const exam = require("./routers/exam");
const appointment = require("./routers/appointment");
const master_data = require("./routers/master_data");
const media_file = require("./routers/media_file");

// const http = require("http");
const os = require("os");
const cluster = require("cluster");
const numOfCpuCores = os.cpus().length;

const port = process.env.PORT || 9200;

app.use(express.json(), cors());

app.use("/", home);
app.use("/user", users);
app.use("/news", news);
app.use("/course", course);
app.use("/exam", exam);
app.use("/appointment", appointment);
app.use("/master_data", master_data);
app.use("/media_file", media_file);
// ทำงานทุก request ที่เข้ามา
app.use(function (req, res, next) {
  var err = createError(404);
  next(err);
});

// ส่วนจัดการ error
app.use(function (err, req, res, next) {
  // กำหนด response local variables
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // กำหนด status และ render หน้า error page
  res.status(err.status || 500).json({
    message: "Bad API!", // error.sqlMessage
  }); // ถ้ามี status หรือถ้าไม่มีใช้เป็น 500
  // res.render("error");
});

if (numOfCpuCores > 1) {
  if (cluster.isMaster) {
    console.log(`Cluster master ${process.pid} is running.`);

    for (let i = 0; i < numOfCpuCores; i++) {
      cluster.fork();
    }

    cluster.on("exit", function (worker) {
      console.log("Worker", worker.id, " has exitted.");
    });
  } else {
    // const server = http.createServer((req, res) => {
    //   res.end("Hello there Fhun!");
    // });

    app.listen(port, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(
          `Server is listening on port ${port} and process ${process.pid}.`
        );
      }
    });
  }
} else {
  app.listen(port, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `Server is listening on port ${port} and process ${process.pid}.`
      );
    }
  });
}

// app.listen(port, () => {
//   console.log("Application is running on port " + port);
// });
