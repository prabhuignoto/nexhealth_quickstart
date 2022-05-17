import classNames from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Select } from "../../components/select";
import commonStyles from "../../styles/common.module.css";
import styles from "./appointment_booking.module.css";

const API = process.env.REACT_APP_API;
const LOCATION_ID = process.env.REACT_APP_LOCATION_ID;

const AppointmentBookingForm = () => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [operators, setOperators] = useState([]);
  const [slots, setSlots] = useState([]);

  const formRef = useRef(null);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const getData = async (type) => {
      const request = await fetch(`${API}/${type}`, {
        credentials: "include",
        method: "GET",
      });

      const result = await request.json();

      if (!result.code) {
        return;
      }

      if (type === "patients") {
        setPatients(result.data.patients);
      } else if (type === "providers") {
        setProviders(
          result.data.map((provider) => ({
            ...provider,
            name: provider.doctor_name,
          }))
        );
      } else if (type === "operatories") {
        setOperators(result.data);
      }
    };

    // fetch patients, providers, operators
    getData("patients");
    getData("providers");
    getData("operatories");
  }, []);

  useEffect(() => {
    const getData = async () => {
      const request = await fetch(
        `${API}/appointments/slots?providerId=${+selectedProvider}&locationId=${LOCATION_ID}&startDate=${selectedDate}`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      const result = await request.json();

      if (result.code && result.data.length) {
        setSlots(
          result.data[0].slots.map((slot) => ({
            ...slot,
            name: slot.time,
          }))
        );
      }
    };

    if (selectedProvider && selectedDate) {
      getData();
    }
  }, [selectedProvider, selectedDate]);

  /** Checks whether the form can be submitted or not */
  const canSubmit = useMemo(
    () =>
      selectedPatient &&
      selectedProvider &&
      selectedOperator &&
      selectedDate &&
      selectedSlot,
    [
      selectedPatient,
      selectedProvider,
      selectedOperator,
      selectedDate,
      selectedSlot,
    ]
  );

  /** handlers */
  const handlePatientSelection = (ev) => setSelectedPatient(ev.target.value);

  const handleProviderSelection = (ev) => setSelectedProvider(ev.target.value);

  const handleOperatorSelection = (ev) => setSelectedOperator(ev.target.value);

  const handleDateSelection = (ev) => setSelectedDate(ev.target.value);

  const handleSlotSelection = (ev) => setSelectedSlot(ev.target.value);

  const handleNotesChange = (ev) => setNotes(ev.target.value);

  /** Resets the form */
  const resetForm = useCallback((ev) => {
    ev.preventDefault();
    if (formRef.current) {
      formRef.current.reset();
      const selects = Array.from(formRef.current.querySelectorAll("select"));
      selects.forEach((select) => (select.selectedIndex = 0));
    }
  }, []);

  /** Handler to submit the form */
  const submitForm = useCallback(
    (ev) => {
      ev.preventDefault();
      const bookAppointment = async () => {
        const request = await fetch(`${API}/appointments/book-appointment`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appt: {
              patient_id: selectedPatient,
              provider_id: selectedProvider,
              operatory_id: selectedOperator,
              start_time: selectedSlot,
              confirmed: true,
              note: notes,
            },
          }),
        });

        const result = await request.json();

        if (result.code) {
          alert("Appointment booked successfully!");
        } else {
          alert(`Appointment booking failed!\n${result.error}`);
        }
      };

      if (canSubmit) {
        bookAppointment();
      }
    },
    [canSubmit]
  );

  return (
    <div className={styles.wrapper}>
      <form className={commonStyles.form} ref={formRef}>
        {/* patient */}
        <div className={commonStyles.form_field}>
          <Select
            label="Patient"
            options={patients}
            onChange={handlePatientSelection}
            id="patient"
            placeholder="Select a patient"
          />
        </div>

        {/* provider */}
        <div className={commonStyles.form_field}>
          <Select
            label="Provider"
            options={providers}
            onChange={handleProviderSelection}
            id="provider"
            placeholder="Select a provider"
          />
        </div>

        {/* operatory */}
        <div className={commonStyles.form_field}>
          <Select
            label="Location"
            options={operators}
            onChange={handleOperatorSelection}
            id="location"
            placeholder="Select a location"
          />
        </div>

        {/* provider */}
        <div className={commonStyles.form_field}>
          <label className={commonStyles.label} htmlFor="provider">
            Choose a date
          </label>
          <input
            type="date"
            id="start_time"
            aria-label="start time"
            className={commonStyles.input}
            onChange={handleDateSelection}
          />
        </div>

        <div className={commonStyles.form_field}>
          <Select
            label="Slot"
            options={slots}
            onChange={handleSlotSelection}
            id="slot"
            placeholder="Select a slot"
          />
        </div>

        <div className={commonStyles.form_field}>
          <label className={commonStyles.label} htmlFor="notes">
            Note
          </label>
          <textarea
            className={commonStyles.textarea}
            id="notes"
            onChange={handleNotesChange}
          />
        </div>

        {/* button controls */}
        <div className={commonStyles.controls}>
          <button
            className={classNames(
              commonStyles.button,
              !canSubmit ? commonStyles.disabled : ""
            )}
            disabled={!canSubmit}
            onClick={submitForm}
          >
            Book Appointment
          </button>
          <button className={commonStyles.button} onClick={resetForm}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export { AppointmentBookingForm };
