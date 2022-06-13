import classNames from "classnames";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AddAppointmentCategory } from "../add-appointment-category";
import { CreateAvailability } from "../add-provider-availability";
import { Appointments } from "../appointments";
import { BookingContainer } from "../book-appointment";
import { Availabilities } from "../provider-availabilities";
import styles from "./styles.module.css";

const tabs = [
  { name: "appointments", label: "Appointments" },
  { name: "appointmentCategory", label: "Add Appointment Category" },
  { name: "booking", label: "Book Appointment" },
  { name: "availabilities", label: "Provider Availabilities" },
  { name: "availability", label: "Add Provider Availability" },
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
          {activeTab === "booking" && <BookingContainer />}
          {activeTab === "availability" && <CreateAvailability />}
          {activeTab === "availabilities" && <Availabilities />}
          {activeTab === "appointmentCategory" && <AddAppointmentCategory />}
        </div>
      </section>
    </div>
  );
};

export { Home };
