import { Router } from "express";
import fetch from "node-fetch";
import serverConfig from "../server-config.js";
import { getHeaders } from "../utils.js";

serverConfig();

const authRouter = Router();

authRouter.get("/", async (req, res) => {
  try {
    const response = await fetch(`${process.env.API_URL}/authenticates?`, {
      headers: getHeaders(true),
      method: "POST",
    });

    const result = await response.json();

    if (result.code) {
      req.session.token = result.data.token;
    }

    res.send({
      authenticated: result.code,
    });
  } catch (error) {
    console.log(error);
  }
});

authRouter.get("/logout", async (req, res) => {
  try {
    req.session.destroy();

    res.send({
      authenticated: false,
    });
  } catch (error) {
    console.log(error);
  }
});

authRouter.get("/is-authenticated", async (req, res) => {
  try {
    res.send({
      authenticated: req.session.token ? true : false,
    });
  } catch (error) {
    console.log(error);
  }
});

export { authRouter };
