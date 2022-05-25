import dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
//router 추가 
import indexRouter from './routes';
import userRouter from './routes/users';
import boardRouter from './routes/board';
import alarmRouter from './routes/alarm';
import mediaRouter from './routes/media';

import moment from 'moment';
import sequelize from './models/index';
moment.locale("ko"); // localization.

const { 
  PORT = "3000",
  DB_FORCE = "false", 
	pm_id, 
	NODE_ENV = "development",
  COOKIE_SECRET,
} = process.env;

const port = parseInt(PORT, 10);

const app = express();

const corsOptions = {
  origin: "*", // or process.env.CLIENT_URL.
  optionsSuccessStatus: 200
};

// app options.
app.use(cors(corsOptions));
app.use(helmet());
app.use(logger("dev")); // + winston ?
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));  // static folder.
app.use(cookieParser(COOKIE_SECRET));

// DB Force Init.
let pmInit = false;

if(NODE_ENV === "production") {
  if(pm_id === "0") {
    pmInit = true;
  } else {
    pmInit = false;
  }
} else {
  pmInit = true;
}

const force = DB_FORCE === "true" ? true : false;

// app run.
app.listen(port, async () => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true });

  // DB Sync.
  if(force && pmInit) {
    await sequelize.sync({ force });
  } else {
    await sequelize.sync();
  }

  console.log("mysql database connect success !");

  console.log(`${process.env?.NODE_ENV} Hello Typescript-Express ! ${moment().format("YYYY. MM. DD. (ddd) HH:mm:ss")}`);
  process.send && process.send("ready");
});

// + app.io = socket.io

// error.
app.on("error", (error: any) => {
  if(error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  switch(error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// routes.
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/board", boardRouter);
app.use("/alarm", alarmRouter);
app.use("/media", mediaRouter);


app.use((req: Request, res: Response, next: NextFunction) => {
  // Route Not Found.
  return next({ s: 404, m: "존재하지 않는 URL입니다." });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  /**
   * Route API Error Handling.
   * throw new Error: x.
   * custom handling: return next({ s: status code, m: error message. });
   */

  const status = err.s || err.status || 500;
  const message = err.m || "문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

  console.log(`[${moment().format("YYYY. MM. DD. ddd HH:mm:ss")}]ERROR:`, err);

  return res.status(status).send({
    result: false,
    data: null,
    message
  });
});

export default app;