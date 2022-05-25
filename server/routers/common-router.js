import { Router } from "express";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import serverConfig from "../server-config.js";
import { getHeaders } from "../utils.js";

const router = Router();

serverConfig();

const nexHealthParams = {
  subdomain: process.env.SUBDOMAIN,
  location_id: process.env.LOCATION_ID,
};

router.get("/patients", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      new_patient: false,
      include_upcoming_appts: false,
      location_strict: false,
      page: 1,
      per_page: 50,
    });

    const response = await fetch(`${process.env.API_URL}/patients?${params}`, {
      headers: getHeaders(false, req.session.token),
    });
    const patients = await response.json();
    res.json(patients);
  } catch (error) {
    console.log(error);
  }
});

router.get("/locations", async (req, res) => {
  try {
    const response = await fetch(`${process.env.API_URL}/locations`, {
      headers: getHeaders(false, req.session.token),
    });

    const locations = await response.json();

    res.json(locations);
  } catch (error) {
    console.log(error);
  }
});

export { router };
