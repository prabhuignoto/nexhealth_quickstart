import { Router } from "express";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import serverConfig from "../server-config.js";
import { getHeaders } from "../utils.js";

const providersRouter = Router();

serverConfig();

const nexHealthParams = {
  subdomain: process.env.SUBDOMAIN,
  location_id: process.env.LOCATION_ID,
};

providersRouter.get("/", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 50,
    });

    const response = await fetch(`${process.env.API_URL}/providers?${params}`, {
      headers: getHeaders(false, req.session.token),
    });
    const providers = await response.json();
    res.json(providers);
  } catch (error) {
    console.log(error);
  }
});

providersRouter.get("/:id", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 50,
    });

    const response = await fetch(
      `${process.env.API_URL}/providers/${req.params.id}?${params}`,
      {
        headers: getHeaders(false, req.session.token),
      }
    );
    const provider = await response.json();
    res.json(provider);
  } catch (error) {
    console.log(error);
  }
});

export { providersRouter };
