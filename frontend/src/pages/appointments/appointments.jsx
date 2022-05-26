import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { apiGET } from "../../api-helpers";
import { Loader } from "../../components/loader";
import { patchData } from "../../utils";
import { HomeContext } from "./../../helpers/protected-route";
import { AppointmentsList } from "./appointments-list";
import styles from "./appointments.module.css";

const API = process.env.REACT_APP_API;

const Appointments = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: dayjs(),
    endDate: dayjs().add(24, "hours"),
  });
  const [appointments, setAppointments] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { onError } = useContext(HomeContext);

  const fetchAppointments = async (startDate, endDate) => {
    try {
      setIsLoadingData(true);
      apiGET({
        url: `${API}/appointments?startDate=${startDate}&endDate=${endDate}`,
        onSuccess: (data) => {
          setAppointments(data.filter((appointment) => !appointment.cancelled));
          setIsLoadingData(false);
        },
        onError,
      });
    } catch (error) {
      setIsLoadingData(false);
      onError(error);
    }
  };

  useEffect(() => {
    if (dateFilter.startDate && dateFilter.endDate) {
      const { startDate, endDate } = dateFilter;
      fetchAppointments(startDate, endDate);
    }
  }, [dateFilter.startDate, dateFilter.endDate]);

  const handleStartDateChange = (e) => {
    setDateFilter((prev) => ({
      ...prev,
      startDate: dayjs(e.target.value),
    }));
  };

  const handleEndDateChange = (e) => {
    setDateFilter((prev) => ({
      ...prev,
      endDate: dayjs(e.target.value),
    }));
  };

  const handleCancelAppointment = async (
    id,
    patient_id,
    operatory_id,
    provider_id,
    start_time
  ) => {
    try {
      const request = await patchData(
        `${API}/appointments/cancel-appointment/${id}`,
        {
          appt: {
            patient_id,
            operatory_id,
            provider_id,
            start_time,
            cancelled: true,
          },
        }
      );

      const result = await request.json();

      if (result.code) {
        window.alert("Appointment cancelled successfully");
        fetchAppointments(dateFilter.startDate, dateFilter.endDate);
      } else {
        window.alert(`Failed to cancel appointment\n${result.error}`);
      }
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className={styles.appointments}>
      <div className={styles.filter_wrapper}>
        <div className={styles.filter_fields}>
          <div className={styles.filter_field}>
            <label>From:</label>
            <input
              type="datetime-local"
              aria-label="start-date"
              value={dateFilter.startDate.format("YYYY-MM-DDTHH:mm")}
              onChange={handleStartDateChange}
            />
          </div>
          <div className={styles.filter_field}>
            <label>To:</label>
            <input
              type="datetime-local"
              aria-label="end-date"
              value={dateFilter.endDate.format("YYYY-MM-DDTHH:mm")}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.appointments_list_wrapper}>
        {isLoadingData ? (
          <div className={styles.loader_wrapper}>
            <Loader />
          </div>
        ) : (
          <AppointmentsList
            appointments={appointments}
            onCancel={handleCancelAppointment}
          />
        )}
      </div>
    </div>
  );
};

export { Appointments };
