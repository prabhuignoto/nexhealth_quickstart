import commonStyles from "../../common-styles/common.module.css";
import styles from "../../common-styles/list.module.css";
import { formatDate } from "./../../utils";

const AppointmentsList = ({ appointments = [], onCancel }) => {
  const handleCancel = (
    id,
    patient_id,
    operatory_id,
    provider_id,
    start_time
  ) => {
    window.confirm("Are you sure you want to cancel this appointment?") &&
      onCancel(id, patient_id, operatory_id, provider_id, start_time);
  };
  return (
    <>
      {appointments.length > 0 ? (
        <ul className={styles.list}>
          {/* headers */}
          <li className={styles.appointment_list_headers}>
            <div className={styles.list_header}>Patient Name</div>
            <div className={styles.list_header}>Provider</div>
            <div className={styles.list_header}>Start Time</div>
            <div></div>
          </li>

          {/* appointments */}
          {appointments.map(
            ({
              id,
              patient: { name: patient_name },
              provider_name,
              start_time,
              patient_id,
              operatory_id,
              provider_id,
            }) => (
              <li key={id} className={styles.appointment_list_item}>
                <div className={styles.item_field}>{patient_name}</div>
                <div className={styles.item_field}>{provider_name}</div>
                <div className={styles.item_field}>
                  {formatDate(start_time)}
                </div>
                <div>
                  <button
                    className={commonStyles.button}
                    onClick={() =>
                      handleCancel(
                        id,
                        patient_id,
                        operatory_id,
                        provider_id,
                        start_time
                      )
                    }
                  >
                    Cancel Appointment
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      ) : (
        <span role="alert">No Appointments found</span>
      )}
    </>
  );
};

export { AppointmentsList };
