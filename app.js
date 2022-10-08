var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// 加载env文件
const dotenv = require("dotenv");
dotenv.config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// 定时任务
const schedule = require("node-schedule");
const dayjs = require("dayjs");
const { chargeTime } = require("./api/index");
const rule = new schedule.RecurrenceRule();
rule.hour = [8, 12, 18];
rule.minute = [0];
rule.second = 0;

const job = schedule.scheduleJob(rule, function () {
  console.log("现在时间：", dayjs().format("YYYY-MM-DD HH:mm:ss"));
  const config = { words: "greet" };
  chargeTime(config);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
