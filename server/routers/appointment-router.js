import { Router } from "express";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import serverConfig from "../server-config.js";
import { getHeaders } from "../utils.js";

const appointmentRouter = Router();

serverConfig();

const nexHealthParams = {
  subdomain: process.env.SUBDOMAIN,
  location_id: process.env.LOCATION_ID,
};

appointmentRouter.get("/", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 50,
      start: req.query.startDate,
      end: req.query.endDate,
    });

    const response = await fetch(
      `${process.env.API_URL}/appointments?${params}`,
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

appointmentRouter.get("/filter-by-provider/:id", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 50,
      start: req.query.startDate,
      end: req.query.endDate,
      "provider_ids[]": req.params.id,
    });

    const response = await fetch(
      `${process.env.API_URL}/appointments?${params}`,
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

appointmentRouter.get("/slots", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      start_date: req.query.startDate,
      "lids[]": req.query.locationId,
      "pids[]": req.query.providerId,
      "operatory_ids[]": req.query.operatoryId,
      days: 1,
      slot_length: 30,
    });

    const response = await fetch(
      `${process.env.API_URL}/appointment_slots?${params}`,
      {
        headers: getHeaders(false, req.session.token),
      }
    );

    const appointmentSlots = await response.json();

    res.json(appointmentSlots);
  } catch (error) {
    console.log(error);
  }
});

appointmentRouter.post("/book-appointment", async (req, res) => {
  const params = new URLSearchParams({
    ...nexHealthParams,
  });

  const response = await fetch(
    `${process.env.API_URL}/appointments?${params}`,
    {
      method: "POST",
      headers: getHeaders(false, req.session.token),
      body: JSON.stringify(req.body),
    }
  );

  const appointment = await response.json();

  res.json(appointment);
});

export { appointmentRouter };
