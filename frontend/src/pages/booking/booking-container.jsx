import { default as dayJs, default as dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { apiGET } from "../../api-helpers";
import { OverlayLoader } from "../../components/overlay-loader";
import { HomeContext } from "../../helpers/protected-route";
import { formatDate, postData } from "../../utils";
import { AppointmentBookingForm } from "./booking";
import styles from "./booking.module.css";

dayjs.extend(utc);

const API = process.env.REACT_APP_API;

const BookingContainer = () => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [operators, setOperators] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeAppointments, setActiveAppointments] = useState([]);

  const [slots, setSlots] = useState([]);
  const { onError } = useContext(HomeContext);
  const [showOverlayLoader, setShowOverlayLoader] = useState(false);

  const getAppointments = useMemo(
    () =>
      activeAppointments.filter(
        (appointment) => appointment.operatory_id === +selectedLocation
      ),
    [activeAppointments.length, selectedLocation]
  );

  console.log(getAppointments, selectedLocation);

  const reset = () => {
    setOperators([]);
    setLocations([]);
    setSlots([]);
    setActiveAppointments([]);
  };

  const onSubmit = async (data) => {
    try {
      const request = await postData(
        `${API}/appointments/book-appointment`,
        data
      );

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
  const handleSelectedLocation = (location) => setSelectedLocation(location);

  const handleFetchSlots = (params) => {
    setShowOverlayLoader(true);
    apiGET({
      url: `${API}/appointments/slots?${params}`,
      onSuccess: (data) => {
        setShowOverlayLoader(false);
        debugger;
        setSlots(
          data[0].slots.map((slot) => ({
            ...slot,
            name: formatDate(slot.time),
            id: dayjs(slot.time).utc().format(),
          }))
        );
      },
      onError,
    });
  };

  const onProviderSelected = (providerId) => {
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

      const startDate = dayJs(new Date()).format();
      const endDate = dayJs(new Date()).add(4, "month").format();

      const params = new URLSearchParams({
        startDate,
        endDate,
      });

      apiGET({
        url: `${API}/appointments/filter-by-provider/${providerId}?${params.toString()}`,
        onSuccess: (data) => {
          console.log("appointments", data);
          setActiveAppointments(data);
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
        onLocationSelected={handleSelectedLocation}
        slots={slots}
        onPatientTypeChange={handlePatientTypeChange}
      />
      {showOverlayLoader && <OverlayLoader />}
    </div>
  );
};

export { BookingContainer };
