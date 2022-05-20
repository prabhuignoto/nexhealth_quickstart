import React from "react";
import styles from "../../styles/list.module.css";

const AppointmentsList = ({ appointments = [] }) => {
  return (
    <>
      {appointments.length > 0 ? (
        <ul className={styles.list}>
          {/* headers */}
          <li className={styles.appointment_list_headers}>
            <div className={styles.list_header}>Patient Name</div>
            <div className={styles.list_header}>Note</div>
            <div className={styles.list_header}>Provider</div>
            <div className={styles.list_header}>Start Time</div>
          </li>

          {/* appointments */}
          {appointments.map(
            ({ id, patient_name, note, provider_name, start_time }) => (
              <li key={id} className={styles.appointment_list_item}>
                <div className={styles.item_field}>{patient_name}</div>
                <div className={styles.item_field}>{note}</div>
                <div className={styles.item_field}>{provider_name}</div>
                <div className={styles.item_field}>{start_time}</div>
              </li>
            )
          )}
        </ul>
      ) : (
        <span role="alert">No Appointments available</span>
      )}
    </>
  );
};

export { AppointmentsList };
