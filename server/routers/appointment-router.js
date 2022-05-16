import { config } from "dotenv";
import { Router } from "express";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { getHeaders } from "../utils.js";

const appointmentRouter = Router();

config();

const nexHealthParams = {
  subdomain: process.env.DOMAIN,
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

appointmentRouter.get("/slots", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      start_date: req.query.startDate,
      "lids[]": req.query.locationId,
      "pids[]": req.query.providerId,
      days: 1,
    });

    console.log(`${process.env.API_URL}/appointment_slots?${params}`);

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

  console.log(`${process.env.API_URL}/appointments?${params}`);

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

appointmentRouter.get("/availabilities", async (req, res) => {
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

appointmentRouter.delete("/delete-availability/:id", async (req, res) => {
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

    res.json(availability);
  } catch (error) {
    console.log(error);
  }
});

appointmentRouter.post("/create-availability", async (req, res) => {
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

export { appointmentRouter };
