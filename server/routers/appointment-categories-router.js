import { Router } from "express";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import serverConfig from "../server-config.js";
import { getHeaders } from "../utils.js";

const appointmentCategoriesRouter = Router();

serverConfig();

const nexHealthParams = {
  subdomain: process.env.SUBDOMAIN,
  location_id: process.env.LOCATION_ID,
};

appointmentCategoriesRouter.get("/", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
    });

    const response = await fetch(
      `${process.env.API_URL}/appointment_categories?${params}`,
      {
        headers: getHeaders(false, req.session.token),
      }
    );

    const appointments = await response.json();

    res.json(appointments);
  } catch (error) {
    console.log(error);
  }
});

appointmentCategoriesRouter.get("/:id", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
    });

    const response = await fetch(
      `${process.env.API_URL}/appointment_categories/${req.params.id}?${params}`,
      {
        headers: getHeaders(false, req.session.token),
      }
    );

    const appointments = await response.json();

    res.json(appointments);
  } catch (error) {
    console.log(error);
  }
});

appointmentCategoriesRouter.post("/", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
    });

    const response = await fetch(
      `${process.env.API_URL}/appointment_categories?${params}`,
      {
        method: "POST",
        headers: getHeaders(false, req.session.token),
        body: JSON.stringify(req.body),
      }
    );

    const appointments = await response.json();

    res.json(appointments);
  } catch (error) {
    console.log(error);
  }
});

export { appointmentCategoriesRouter };
