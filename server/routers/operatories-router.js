import { Router } from "express";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import serverConfig from "../server-config.js";
import { getHeaders } from "../utils.js";

const operatoriesRouter = Router();

serverConfig();

const nexHealthParams = {
  subdomain: process.env.SUBDOMAIN,
  location_id: process.env.LOCATION_ID,
};

operatoriesRouter.get("/", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 50,
    });

    const response = await fetch(
      `${process.env.API_URL}/operatories?${params}`,
      {
        headers: getHeaders(false, req.session.token),
      }
    );

    const operatories = await response.json();

    res.json(operatories);
  } catch (error) {
    console.log(error);
  }
});

operatoriesRouter.get("/:id", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 50,
    });

    const response = await fetch(
      `${process.env.API_URL}/operatories/${req.params.id}?${params}`,
      {
        headers: getHeaders(false, req.session.token),
      }
    );
    const operator = await response.json();
    res.json(operator);
  } catch (error) {
    console.log(error);
  }
});

export { operatoriesRouter };
