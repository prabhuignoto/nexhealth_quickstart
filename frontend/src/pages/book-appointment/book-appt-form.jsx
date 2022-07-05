import classNames from "classnames";
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import commonStyles from "../../common-styles/common.module.css";
import { HomeContext } from "../../helpers/protected-route";
import { Days } from "../../utils";
import { Fields } from "./book-appt-fields";
import { AddPatient } from "./new-patient-field";
import styles from "./styles.module.css";

const AppointmentBookingForm = React.forwardRef((props, ref) => {
  const {
    apptCategories,
    onFetchSlots,
    onPatientTypeChange,
    onProviderSelected,
    onSubmit,
    operatories,
    availabilities,
    patients,
    providers,
    slots,
  } = props;

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedOperatory, setSelectedOperatory] = useState(null);
  const [selectedApptCategory, setSelectedApptCategory] = useState(null);

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
      setSelectedOperatory("");
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
        if (selectedOperatory) {
          const locations = locationsData.locations;

          if (!locations.length) {
            return;
          }

          const locationId = locations[0].locations[0].id;

          onFetchSlots({
            locationId,
            providerId: selectedProvider,
            startDate: selectedDate,
            operatoryId: selectedOperatory,
          });
        }
      } catch (error) {
        onError(error);
      }
    };

    // start fetching slots once the date and location are selected
    if (selectedDate && selectedOperatory) {
      fetchSlots();
    }
  }, [selectedDate, locationsData, selectedOperatory]);

  const patientDataEntered = useMemo(
    () => selectedPatient || (patientInfo.firstName && patientInfo.lastName),
    [selectedPatient, patientInfo]
  );

  const disabledDays = useMemo(() => {
    let disabledDays = [];

    if (availabilities.length && selectedOperatory) {
      const availableDays = availabilities
        .filter((op) => op.operatory_id === +selectedOperatory)
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
  }, [availabilities.length, selectedOperatory]);

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
    setSelectedOperatory("");
    setSelectedProvider(ev.target.value);
  };
  const handleOperatorySelection = (ev) => {
    setSelectedOperatory(ev.target.value);
  };
  const handleApptCategorySelection = (ev) => {
    setSelectedApptCategory(ev.target.value);
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
            patient_id: +selectedPatient,
          };
        } else {
          patientData = {
            is_guardian: true,
            patient_id: +patients[0].id,
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
            provider_id: +selectedProvider,
            operatory_id: +selectedOperatory,
            appointment_type_id: +selectedApptCategory,
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
          onDOBChange={handlePatientDOBChange}
          onFirstNameChange={handlePatientFirstNameChange}
          onGenderChange={handlePatientGenderChange}
          onLastNameChange={handlePatientLastNameChange}
          onPatientSelection={handlePatientSelection}
          onTypeChange={handlePatientTypeChange}
          patientType={patientType}
          patients={patients}
        />

        <Fields
          disabledDays={disabledDays}
          handleDateSelection={handleDateSelection}
          handleNotesChange={handleNotesChange}
          handleOperatorySelection={handleOperatorySelection}
          handleProviderSelection={handleProviderSelection}
          handleSlotSelection={handleSlotSelection}
          handleApptCategorySelection={handleApptCategorySelection}
          operatories={operatories}
          patientType={patientType}
          providers={providers}
          apptCategories={apptCategories}
          ref={bookingFieldsRef}
          slots={slots}
        />

        {/* button controls */}
        <div className={commonStyles.controls}>
          <button
            className={classNames(
              commonStyles.button,
              commonStyles.button_margin,
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

AppointmentBookingForm.displayName = "AppointmentBookingForm";

export { AppointmentBookingForm };
