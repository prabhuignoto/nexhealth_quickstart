import React, { useContext, useEffect, useState } from "react";
import { apiGET } from "../../api-helpers";
import { OverlayLoader } from "../../components/overlay-loader";
import { HomeContext } from "../../helpers/protected-route";
import { formatDate, postData } from "../../utils";
import { AppointmentBookingForm } from "./booking";
import styles from "./booking.module.css";

const API = process.env.REACT_APP_API;

const BookingContainer = () => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [operators, setOperators] = useState([]);
  const [locations, setLocations] = useState([]);

  const [slots, setSlots] = useState([]);
  const { onError } = useContext(HomeContext);
  const [showOverlayLoader, setShowOverlayLoader] = useState(false);

  const reset = () => {
    setOperators([]);
    setLocations([]);
    setSlots([]);
  };

  const onSubmit = async (data) => {
    try {
      const request = postData(`${API}/appointments/book-appointment`, data);

      const result = await request.json();

      if (result.code) {
        alert("Appointment booked successfully!");
      } else {
        alert(`Appointment booking failed!\n${result.error}`);
      }
    } catch (error) {
      onError(error);
    }
  };

  const handlePatientTypeChange = () => reset();

  const handleFetchSlots = async (params) => {
    apiGET({
      url: `${API}/appointments/slots?${params}`,
      onSuccess: (data) => {
        setSlots(
          data[0].slots.map((slot) => ({
            ...slot,
            name: formatDate(slot.time),
          }))
        );
      },
      onError,
    });
  };

  const onProviderSelected = async (providerId) => {
    try {
      setLocations([]);
      setShowOverlayLoader(true);
      apiGET({
        url: `${API}/availabilities/provider/${providerId}`,
        onSuccess: (data) => {
          setShowOverlayLoader(false);
          setOperators(data);
        },
        onError,
      });
    } catch (error) {
      setShowOverlayLoader(false);
      onError(error);
    }
  };

  useEffect(() => {
    if (operators.length) {
      let count = 0;
      setShowOverlayLoader(true);

      operators.forEach((operator) => {
        apiGET({
          url: `${API}/operatories/${operator.operatory_id}`,
          onSuccess: (data) => {
            count += 1;
            if (operators.length === count) {
              setShowOverlayLoader(false);
            }
            setLocations((prev) => {
              const exists = prev.some((location) => location.id === data.id);
              if (!exists) {
                return prev.concat({ id: data.id, name: data.name });
              } else {
                return prev;
              }
            });
          },
          onError,
        });
      });
    }
  }, [JSON.stringify(operators)]);

  // on load fetch the patients and providers
  useEffect(() => {
    const fetchData = (type) => {
      apiGET({
        url: `${API}/${type}`,
        onSuccess: (data) => {
          if (type === "patients") {
            setPatients(data.patients);
          } else if (type === "providers") {
            setProviders(
              data.map((provider) => ({
                ...provider,
                name: provider.doctor_name,
              }))
            );
          }
        },
        onError,
      });
    };

    // fetch patients, providers
    fetchData("patients");
    fetchData("providers");
  }, []);

  return (
    <div className={styles.booking_container}>
      <AppointmentBookingForm
        patients={patients}
        providers={providers}
        locations={locations}
        operators={operators}
        onSubmit={onSubmit}
        onFetchSlots={handleFetchSlots}
        onProviderSelected={onProviderSelected}
        slots={slots}
        onPatientTypeChange={handlePatientTypeChange}
      />
      {showOverlayLoader && <OverlayLoader />}
    </div>
  );
};

export { BookingContainer };
