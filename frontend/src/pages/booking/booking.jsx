import classNames from "classnames";
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { HomeContext } from "../../helpers/protected-route";
import commonStyles from "../../styles/common.module.css";
import { Days } from "../../utils";
import { AddPatient } from "./add-patient-field";
import { BookingFields } from "./booking-fields";
import styles from "./booking.module.css";

const AppointmentBookingForm = React.forwardRef((props, ref) => {
  const {
    patients,
    providers,
    operators,
    onSubmit,
    onProviderSelected,
    onFetchSlots,
    slots,
    locations,
    onPatientTypeChange,
  } = props;

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");

  const [patientType, setPatientType] = useState("new");
  const [patientInfo, setPatientInfo] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  const formRef = useRef(null);
  const bookingFieldsRef = useRef(null);
  const { onError } = useContext(HomeContext);
  const locationsData = useContext(HomeContext);

  /** Resets the form */
  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
      bookingFieldsRef.current.reset();
      const selects = Array.from(formRef.current.querySelectorAll("select"));
      selects.forEach((select) => (select.selectedIndex = 0));
      setSelectedLocation("");
      setSelectedProvider("");
      setSelectedPatient("");
      setPatientInfo({});
      setSelectedDate(null);
      setSelectedSlot(null);
      setNotes("");
    }
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      resetForm();
    },
  }));

  useEffect(() => {
    if (selectedProvider) {
      onProviderSelected(selectedProvider);
    }
  }, [selectedProvider]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        if (selectedLocation) {
          const locations = locationsData.locations;

          if (!locations.length) {
            return;
          }

          const locationId = locations[0].locations[0].id;

          onFetchSlots({
            locationId,
            providerId: selectedProvider,
            startDate: selectedDate,
            operatoryId: selectedLocation,
          });
        }
      } catch (error) {
        onError(error);
      }
    };

    // start fetching slots once the date and location are selected
    if (selectedDate && selectedLocation) {
      fetchSlots();
    }
  }, [selectedDate, locationsData, selectedLocation]);

  const patientDataEntered = useMemo(
    () => selectedPatient || (patientInfo.firstName && patientInfo.lastName),
    [selectedPatient, patientInfo]
  );

  const disabledDays = useMemo(() => {
    let disabledDays = [];

    if (operators.length && selectedLocation) {
      const availableDays = operators
        .filter((op) => op.operatory_id === +selectedLocation)
        .flatMap((op) => op.days);

      Days.forEach((day, index) => {
        if (!availableDays.includes(day)) {
          disabledDays.push(index);
        }
      });
    } else {
      disabledDays = [..."0123456"].map((x) => +x);
    }

    return disabledDays;
  }, [operators.length, selectedLocation]);

  /** Checks whether the form can be submitted or not */
  const canSubmit = useMemo(
    () =>
      patientDataEntered && selectedProvider && selectedDate && selectedSlot,
    [
      selectedPatient,
      selectedProvider,
      selectedDate,
      selectedSlot,
      patientDataEntered,
    ]
  );

  /** handlers */
  const handlePatientSelection = (ev) => setSelectedPatient(ev.target.value);
  const handleProviderSelection = (ev) => {
    setSelectedLocation("");
    setSelectedProvider(ev.target.value);
  };
  const handleLocationSelection = (ev) => {
    setSelectedLocation(ev.target.value);
  };

  const handleDateSelection = (date) => setSelectedDate(date);

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
    onPatientTypeChange(ev.target.value);
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
  /** handlers */

  /** Handler to submit the form */
  const submitForm = (ev) => {
    ev.preventDefault();
    const bookAppointment = () => {
      try {
        let patientData = null;

        if (patientType === "existing") {
          patientData = {
            patient_id: selectedPatient,
          };
        } else {
          patientData = {
            is_guardian: true,
            patient_id: patients[0].id,
            patient: {
              first_name: patientInfo.firstName,
              last_name: patientInfo.lastName,
              bio: patientInfo.bio,
            },
          };
        }
        onSubmit({
          appt: {
            ...patientData,
            provider_id: selectedProvider,
            operatory_id: selectedLocation,
            start_time: selectedSlot,
            confirmed: true,
            patient_confirmed: true,
            note: notes,
          },
        });
      } catch (error) {
        onError(error);
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

        <BookingFields
          slots={slots}
          providers={providers}
          locations={locations}
          handleDateSelection={handleDateSelection}
          handleProviderSelection={handleProviderSelection}
          handleSlotSelection={handleSlotSelection}
          handleNotesChange={handleNotesChange}
          handleLocationSelection={handleLocationSelection}
          disabledDays={disabledDays}
          patientType={patientType}
          ref={bookingFieldsRef}
        />

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
          <button
            className={commonStyles.button}
            onClick={(ev) => {
              ev.preventDefault();
              resetForm();
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
});

export { AppointmentBookingForm };
