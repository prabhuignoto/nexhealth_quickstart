import classNames from "classnames";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiGET } from "../../api-helpers";
import { Select } from "../../components/select";
import { HomeContext } from "../../helpers/protected-route";
import commonStyles from "../../styles/common.module.css";
import { postData } from "../../utils";
import styles from "./create-availability.module.css";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CreateAvailability = () => {
  const [providers, setProviders] = useState([]);
  const [operatories, setOperatories] = useState([]);
  const [appointmentCategories, setAppointmentCategories] = useState([]);

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedOperatory, setSelectedOperatory] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedAppointmentCategory, setSelectedAppointmentCategory] =
    useState([]);

  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  const formRef = useRef(null);
  const { onError } = useContext(HomeContext);

  const handleProviderSelection = (ev) => setSelectedProvider(ev.target.value);
  const handleOperatorySelection = (ev) =>
    setSelectedOperatory(ev.target.value);

  const handleDaysSelection = (ev) => {
    if (ev.target.checked) {
      setSelectedDays([...selectedDays, ev.target.value]);
    } else {
      setSelectedDays(selectedDays.filter((day) => day !== ev.target.value));
    }
  };

  const handleSelectStartTime = (ev) => setSelectedStartTime(ev.target.value);

  const handleSelectEndTime = (ev) => setSelectedEndTime(ev.target.value);

  const handleSelectedAppointmentCategory = (ev) => {
    const options = Array.from(ev.target.options);
    setSelectedAppointmentCategory(
      options.filter((option) => option.selected).map((v) => +v.value)
    );
  };

  useEffect(() => {
    const getProviders = async () => {
      try {
        apiGET({
          url: `${process.env.REACT_APP_API}/providers`,
          onSuccess: (data) => {
            setProviders(
              data.map((provider) => ({
                ...provider,
                name: provider.doctor_name,
              }))
            );
          },
          onError,
        });
      } catch (error) {
        onError(error);
      }
    };

    const getOperatories = async () => {
      try {
        apiGET({
          url: `${process.env.REACT_APP_API}/operatories`,
          onSuccess: (data) => {
            setOperatories(data);
          },
          onError,
        });
      } catch (error) {
        onError(error);
      }
    };

    const getAppointmentCategories = async () => {
      try {
        apiGET({
          url: `${process.env.REACT_APP_API}/appointment-categories`,
          onSuccess: (data) => {
            setAppointmentCategories(data);
          },
          onError,
        });
      } catch (error) {
        onError(error);
      }
    };

    getProviders();
    getOperatories();
    getAppointmentCategories();
  }, []);

  /** resets the form */
  const resetForm = (ev) => {
    ev && ev.preventDefault();
    if (formRef.current) {
      formRef.current.reset();
      const selects = formRef.current.querySelectorAll("select");
      setSelectedAppointmentCategory([]);
      setSelectedDays([]);
      setSelectedEndTime(null);
      setSelectedOperatory(null);
      setSelectedProvider(null);
      setSelectedStartTime(null);
      Array.from(selects).forEach((select) => {
        select.selectedIndex = 0;
      });
    }
  };

  /** checks whether the form can be submitted or not */
  const canSubmit = useMemo(
    () =>
      selectedDays.length &&
      selectedStartTime &&
      selectedEndTime &&
      selectedOperatory &&
      selectedAppointmentCategory.length &&
      selectedProvider,
    [
      selectedDays.length,
      selectedProvider,
      selectedStartTime,
      selectedEndTime,
      selectedOperatory,
      selectedAppointmentCategory.length,
    ]
  );

  /** submits the form data */
  const handleSubmit = (ev) => {
    ev.preventDefault();

    const createAvailability = async () => {
      try {
        const request = await postData(
          `${process.env.REACT_APP_API}/availabilities/create`,
          {
            availability: {
              active: true,
              begin_time: selectedStartTime,
              days: selectedDays,
              end_time: selectedEndTime,
              operatory_id: selectedOperatory,
              provider_id: selectedProvider,
              appointment_category_ids: selectedAppointmentCategory,
            },
          }
        );

        const result = await request.json();

        if (result.code) {
          resetForm();
          alert("Availability created successfully");
        } else {
          alert(`Availability creation failed!\n${result.error}`);
        }
      } catch (error) {
        onError(error);
      }
    };

    if (canSubmit) {
      createAvailability();
    }
  };

  return (
    <div className={styles.wrapper}>
      <form ref={formRef} className={commonStyles.form}>
        <div className={commonStyles.form_field}>
          <Select
            label="Provider"
            options={providers}
            onChange={handleProviderSelection}
            id="providers"
            placeholder="Select a provider"
          />
        </div>
        <div className={commonStyles.form_field}>
          <Select
            label="Location"
            options={operatories}
            placeholder="Select a location"
            id="location"
            onChange={handleOperatorySelection}
          />
        </div>
        <div className={commonStyles.form_field}>
          <label className={commonStyles.label} htmlFor="days">
            Select days the provider is available
          </label>
          <div className={styles.days}>
            {days.map((day) => (
              <div key={day} className={styles.day}>
                <input
                  type="checkbox"
                  id={day}
                  value={day}
                  name="days"
                  onChange={handleDaysSelection}
                />
                <label htmlFor={day}>{day}</label>
              </div>
            ))}
          </div>
        </div>
        <div className={commonStyles.form_field}>
          <label className={commonStyles.label}>
            Select the start and end time for the provider availability
          </label>
          <div className={styles.time_slots}>
            <div className={styles.time_slot}>
              From{" "}
              <input
                type="time"
                placeholder="Start time"
                aria-label="start time"
                onChange={handleSelectStartTime}
              />
            </div>
            <div className={styles.time_slot}>
              To{" "}
              <input
                type="time"
                placeholder="End time"
                aria-label="end time"
                onChange={handleSelectEndTime}
              />
            </div>
          </div>
        </div>

        <div className={commonStyles.form_field}>
          <Select
            label="Choose Appointment Category"
            options={appointmentCategories}
            placeholder="Select a category"
            id="appointment-category"
            onChange={handleSelectedAppointmentCategory}
            multiple
          />
        </div>

        <div className={commonStyles.controls}>
          <button
            className={classNames(
              commonStyles.button,
              commonStyles.button_margin,
              !canSubmit ? commonStyles.disabled : ""
            )}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Add Availability
          </button>
          <button onClick={resetForm} className={commonStyles.button}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export { CreateAvailability };
