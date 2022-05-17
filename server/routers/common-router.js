import { config } from "dotenv";
import { Router } from "express";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { getHeaders } from "../utils.js";

const router = Router();

config();

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
      per_page: 5,
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

router.get("/providers", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 5,
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

router.get("/providers/:id", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 5,
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

router.get("/locations", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 5,
    });

    const response = await fetch(`${process.env.API_URL}/locations?${params}`, {
      headers: getHeaders(false, req.session.token),
    });

    const locations = await response.json();

    res.json(locations);
  } catch (error) {
    console.log(error);
  }
});

router.get("/operatories", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...nexHealthParams,
      page: 1,
      per_page: 5,
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

export { router };
