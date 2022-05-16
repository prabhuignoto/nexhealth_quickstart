import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import session from "express-session";
import url from "url";
import { appointmentRouter } from "./routers/appointment-router.js";
import { authRouter } from "./routers/auth-router.js";
import { router } from "./routers/common-router.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

config();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  const path = url.parse(req.url).pathname;

  if (path === "/api/auth" || path === "api/auth/is-authenticated") {
    next();
  } else if (req.session.token) {
    next();
  } else {
    res.json({
      code: "false",
      error: "You are not authorized to access this resource",
    });
  }
});

app.use("/api", router);
app.use("/api/auth", authRouter);
app.use("/api/appointments", appointmentRouter);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
