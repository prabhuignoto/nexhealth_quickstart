import classNames from "classnames";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Appointments } from "../appointments/appointments";
import { Availabilities } from "../availability/availabilities";
import { CreateAvailability } from "../availability/create-availability";
import { AppointmentBookingForm } from "../booking/booking";
import styles from "./home.module.css";

const tabs = [
  { name: "appointments", label: "Appointments" },
  { name: "booking", label: "Book Appointment" },
  { name: "availability", label: "Add Provider Availability" },
  { name: "availabilities", label: "Provider Availabilities" },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState("appointments");

  const handleTabSelection = (id) => setActiveTab(id);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.title}>NexHealth Appointment Booking</h2>
        <Link to="/logout" style={{ marginLeft: "auto", marginRight: "1rem" }}>
          Logout
        </Link>
      </header>
      <section className={styles.body}>
        <ul className={styles.tabs}>
          {tabs.map(({ name, label }) => (
            <li
              className={classNames(
                styles.tab,
                activeTab === name ? styles.active : ""
              )}
              onClick={() => handleTabSelection(name)}
              key={name}
            >
              {label}
            </li>
          ))}
        </ul>
        <div className={styles.tabs_body}>
          {activeTab === "appointments" && <Appointments />}
          {activeTab === "booking" && <AppointmentBookingForm />}
          {activeTab === "availability" && <CreateAvailability />}
          {activeTab === "availabilities" && <Availabilities />}
        </div>
      </section>
    </div>
  );
};

export { Home };
