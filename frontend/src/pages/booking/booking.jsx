import classNames from "classnames";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { HomeContext } from "../../App";
import { Select } from "../../components/select";
import commonStyles from "../../styles/common.module.css";
import { getData } from "../../utils";
import { AddPatient } from "./add-patient-field";
import styles from "./booking.module.css";

const API = process.env.REACT_APP_API;

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

  const [patientType, setPatientType] = useState("new");
  const [patientInfo, setPatientInfo] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  const locationsData = useContext(HomeContext);

  useEffect(() => {
    const fetchData = async (type) => {
      try {
        const request = await getData(`${API}/${type}`);

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
      } catch (error) {
        console.log(error);
      }
    };

    // fetch patients, providers, operators
    fetchData("patients");
    fetchData("providers");
    fetchData("operatories");
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const locations = locationsData.locations;

        if (!locations.length) {
          return;
        }

        const locationId = locations[0].locations[0].id;
        const request = await getData(
          `${API}/appointments/slots?providerId=${+selectedProvider}&locationId=${locationId}&startDate=${selectedDate}`
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
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedProvider && selectedDate) {
      fetchSlots();
    }
  }, [selectedProvider, selectedDate, locationsData]);

  const patientDataEntered = useMemo(
    () => selectedPatient || (patientInfo.firstName && patientInfo.lastName),
    [selectedPatient, patientInfo]
  );

  /** Checks whether the form can be submitted or not */
  const canSubmit = useMemo(
    () =>
      patientDataEntered &&
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
      patientDataEntered,
    ]
  );

  /** handlers */
  const handlePatientSelection = (ev) => setSelectedPatient(ev.target.value);
  const handleProviderSelection = (ev) => setSelectedProvider(ev.target.value);
  const handleOperatorSelection = (ev) => setSelectedOperator(ev.target.value);

  const handleDateSelection = (ev) => setSelectedDate(ev.target.value);

  const handleSlotSelection = (ev) => setSelectedSlot(ev.target.value);
  const handleNotesChange = (ev) => setNotes(ev.target.value);
  const handlePatientTypeChange = (ev) => {
    setSelectedPatient("");
    setPatientInfo({
      firstName: "",
      lastName: "",
      bio: {
        date_of_birth: "",
        gender: "",
      },
    });
    setPatientType(ev.target.value);
  };

  const handlePatientFirstNameChange = (ev) =>
    setPatientInfo((prev) => ({ ...prev, firstName: ev.target.value }));
  const handlePatientLastNameChange = (ev) =>
    setPatientInfo((prev) => ({ ...prev, lastName: ev.target.value }));
  const handlePatientDOBChange = (ev) =>
    setPatientInfo((prev) => ({
      ...prev,
      bio: { ...prev.bio, date_of_birth: ev.target.value },
    }));

  const handlePatientGenderChange = (ev) => {
    setPatientInfo((prev) => ({
      ...prev,
      bio: { ...prev.bio, gender: ev.target.value },
    }));
  };

  /** Resets the form */
  const resetForm = (ev) => {
    ev.preventDefault();
    if (formRef.current) {
      formRef.current.reset();
      const selects = Array.from(formRef.current.querySelectorAll("select"));
      selects.forEach((select) => (select.selectedIndex = 0));
    }
  };

  /** Handler to submit the form */
  const submitForm = (ev) => {
    ev.preventDefault();
    const bookAppointment = async () => {
      let patientData = null;

      if (patientType === "existing") {
        patientData = {
          patient_id: selectedPatient,
        };
      } else {
        patientData = {
          is_new_clients_patient: true,
          is_guardian: true,
          patient_id: patients[0].id,
          patient: {
            first_name: patientInfo.firstName,
            last_name: patientInfo.lastName,
            bio: patientInfo.bio,
          },
        };
      }

      const request = await fetch(`${API}/appointments/book-appointment`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appt: {
            ...patientData,
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
  };

  return (
    <div className={styles.wrapper}>
      <form className={commonStyles.form} ref={formRef}>
        {/* patient */}
        <AddPatient
          patientType={patientType}
          onTypeChange={handlePatientTypeChange}
          onFirstNameChange={handlePatientFirstNameChange}
          onLastNameChange={handlePatientLastNameChange}
          onDOBChange={handlePatientDOBChange}
          onGenderChange={handlePatientGenderChange}
          onPatientSelection={handlePatientSelection}
          patients={patients}
        />

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
