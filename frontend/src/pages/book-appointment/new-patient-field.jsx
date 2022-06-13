import commonStyles from "../../common-styles/common.module.css";
import { Select } from "../../components/select";
import styles from "./styles.module.css";

const AddPatient = ({
  patientType,
  onTypeChange,
  onFirstNameChange,
  onLastNameChange,
  onDOBChange,
  onGenderChange,
  patients = [],
  onPatientSelection,
}) => {
  return (
    <div className={commonStyles.form_field}>
      <div className={styles.add_patient_label}>
        <label className={commonStyles.label}>
          <input
            type="radio"
            name="patient_selection"
            id="patient_self"
            aria-label="new patient"
            value="new"
            checked={patientType === "new"}
            onChange={onTypeChange}
          />
          New Patient
        </label>
        <label className={commonStyles.label} style={{ marginLeft: "0.5rem" }}>
          <input
            type="radio"
            name="patient_selection"
            id="patient_existing"
            aria-label="existing patient"
            value="existing"
            checked={patientType === "existing"}
            onChange={onTypeChange}
          />
          Existing Patient
        </label>
      </div>
      {patientType === "new" ? (
        <div style={{ boxShadow: "none", width: "100%", padding: 0 }}>
          <div
            className={commonStyles.form_field}
            style={{ boxShadow: "none", padding: 0, margin: 0 }}
          >
            <input
              type="text"
              aria-label="first name"
              placeholder="First Name"
              className={commonStyles.input}
              onChange={onFirstNameChange}
            />
            <input
              type="text"
              aria-label="last name"
              placeholder="Last Name"
              className={commonStyles.input}
              onChange={onLastNameChange}
            />
            <div
              className={commonStyles.form_field}
              style={{ boxShadow: "none", padding: 0, margin: 0 }}
            >
              <label className={commonStyles.label}>Date of Birth</label>
              <input
                type="date"
                aria-label="date of birth"
                placeholder="Date of birth"
                className={commonStyles.input}
                onChange={onDOBChange}
              />
            </div>
            <div
              className={commonStyles.form_field}
              style={{ boxShadow: "none", padding: 0, margin: 0 }}
            >
              <label className={commonStyles.label}>Gender</label>
              <select
                onChange={onGenderChange}
                defaultValue="default"
                className={commonStyles.select}
              >
                <option value="default" disabled>
                  Select a Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={commonStyles.form_field}
          style={{ boxShadow: "none", padding: 0 }}
        >
          <Select
            options={patients}
            onChange={onPatientSelection}
            id="patient"
            placeholder="Select a patient"
          />
        </div>
      )}
    </div>
  );
};

export { AddPatient };
