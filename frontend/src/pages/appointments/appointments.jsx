import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "../../components/loader";
import { FAILURE_MESSAGES } from "../../messages";
import { getData } from "../../utils";
import { AppointmentsList } from "./appointments-list";
import styles from "./appointments.module.css";

const API = process.env.REACT_APP_API;

const Appointments = () => {
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const [appointments, setAppointments] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const onStartDateRef = useCallback((node) => {
    if (node) {
      startDateRef.current = node;
      const startDate = new Date().toISOString().split("T")[0];
      node.value = startDate;
      setDateFilter((prev) => ({ ...prev, startDate }));
    }
  }, []);

  const onEndDateRef = useCallback((node) => {
    if (node) {
      endDateRef.current = node;

      const date = new Date();
      const newDate = date.setDate(date.getDate() + 15);
      const endDate = new Date(newDate).toISOString().split("T")[0];
      node.value = endDate;
      setDateFilter((prev) => ({ ...prev, endDate }));
    }
  }, []);

  useEffect(() => {
    if (dateFilter.startDate && dateFilter.endDate) {
      const fetchAppointments = async () => {
        try {
          setIsLoadingData(true);
          const request = await getData(
            `${API}/appointments?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
          );
          const result = await request.json();

          if (result.code) {
            setAppointments(result.data);
            setIsLoadingData(false);

            setDateFilter(() => ({ startDate: "", endDate: "" }));
          }
        } catch (error) {
          setIsLoadingData(false);
          window.alert(FAILURE_MESSAGES.SERVER_DOWN);
        }
      };

      fetchAppointments();
    }
  }, [dateFilter.startDate, dateFilter.endDate]);

  const handleStartDateChange = (e) => {
    if (endDateRef.current) {
      setDateFilter(() => ({
        endDate: endDateRef.current.value,
        startDate: e.target.value,
      }));
    }
  };

  const handleEndDateChange = (e) => {
    if (startDateRef.current) {
      setDateFilter(() => ({
        startDate: startDateRef.current.value,
        endDate: e.target.value,
      }));
    }
  };

  return (
    <div className={styles.appointments}>
      <div className={styles.filter_wrapper}>
        <div className={styles.filter_fields}>
          <div className={styles.filter_field}>
            <label>From:</label>
            <input
              type="date"
              aria-label="start-date"
              ref={onStartDateRef}
              onChange={handleStartDateChange}
            />
          </div>
          <div className={styles.filter_field}>
            <label>To:</label>
            <input
              type="date"
              aria-label="end-date"
              ref={onEndDateRef}
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
          <AppointmentsList appointments={appointments} />
        )}
      </div>
    </div>
  );
};

export { Appointments };
