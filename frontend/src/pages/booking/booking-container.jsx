import React, { useContext, useEffect, useState } from "react";
import { apiGET } from "../../api-helpers";
import { HomeContext } from "../../helpers/protected-route";
import { formatDate, postData } from "../../utils";
import { AppointmentBookingForm } from "./booking";

const API = process.env.REACT_APP_API;

const BookingContainer = () => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [operators, setOperators] = useState([]);
  const [locations, setLocations] = useState([]);

  const [slots, setSlots] = useState([]);
  const { onError } = useContext(HomeContext);

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

  const onLocationSelected = async (params) => {
    try {
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
    } catch (error) {
      onError(error);
    }
  };

  const onProviderSelected = async (providerId) => {
    setLocations([]);
    apiGET({
      url: `${API}/availabilities/provider/${providerId}`,
      onSuccess: (data) => setOperators(data),
      onError,
    });
  };

  useEffect(() => {
    if (operators.length) {
      operators.forEach((operator) => {
        apiGET({
          url: `${API}/operatories/${operator.operatory_id}`,
          onSuccess: (data) => {
            setLocations((prev) =>
              prev.concat({ id: data.id, name: data.name })
            );
          },
          onError,
        });
      });
    }
  }, [operators.length]);

  useEffect(() => {
    const fetchData = (type) => {
      try {
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
      } catch (error) {
        onError(error);
      }
    };

    // fetch patients, providers
    fetchData("patients");
    fetchData("providers");
  }, []);

  return (
    <AppointmentBookingForm
      patients={patients}
      providers={providers}
      locations={locations}
      onSubmit={onSubmit}
      onLocationSelected={onLocationSelected}
      onProviderSelected={onProviderSelected}
      slots={slots}
    />
  );
};

export { BookingContainer };
