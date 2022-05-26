import { Router } from "express";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import serverConfig from "../server-config.js";
import { getHeaders } from "../utils.js";

const availabilitiesRouter = Router();

serverConfig();

const nexHealthParams = {
  subdomain: process.env.SUBDOMAIN,
  location_id: process.env.LOCATION_ID,
};

availabilitiesRouter.get("/", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 20,
      active: true,
      ignore_past_dates: false,
    });

    const response = await fetch(
      `${process.env.API_URL}/availabilities?${params}`,
      {
        headers: getHeaders(false, req.session.token),
      }
    );

    const availabilities = await response.json();

    res.json(availabilities);
  } catch (error) {
    console.log(error);
  }
});

availabilitiesRouter.get("/provider/:id", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 50,
      active: true,
      provider_id: req.params.id,
    });

    const response = await fetch(
      `${process.env.API_URL}/availabilities?${params}`,
      {
        headers: getHeaders(false, req.session.token),
      }
    );

    const availabilities = await response.json();
    res.json(availabilities);
  } catch (error) {
    console.log(error);
  }
});

availabilitiesRouter.delete("/delete/:id", async (req, res) => {
  try {
    const params = new URLSearchParams({
      subdomain: nexHealthParams.subdomain,
    });

    const response = await fetch(
      `${process.env.API_URL}/availabilities/${req.params.id}?${params}`,
      {
        method: "DELETE",
        headers: getHeaders(false, req.session.token),
      }
    );

    res.status(200).send({ message: "Availability deleted", code: true });
  } catch (error) {
    console.log(error);
  }
});

availabilitiesRouter.post("/create", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
    });

    const response = await fetch(
      `${process.env.API_URL}/availabilities?${params}`,
      {
        method: "POST",
        headers: getHeaders(true, req.session.token),
        body: JSON.stringify(req.body),
      }
    );

    const availability = await response.json();

    res.json(availability);
  } catch (error) {
    console.log(error);
  }
});

export { availabilitiesRouter };
