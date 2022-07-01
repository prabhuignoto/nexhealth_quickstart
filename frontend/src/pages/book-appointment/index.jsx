import { default as dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiGET } from "../../api-helpers";
import { OverlayLoader } from "../../components/overlay-loader";
import { HomeContext } from "../../helpers/protected-route";
import { formatDate, postData } from "../../utils";
import { removeDuplicates } from "./../../utils";
import { AppointmentBookingForm } from "./book-appt-form";
import styles from "./styles.module.css";

dayjs.extend(utc);

const API = process.env.REACT_APP_API;

const BookingContainer = () => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [operators, setOperators] = useState([]);
  const [operatories, setOperatories] = useState([]);

  const [slots, setSlots] = useState([]);
  const { onError } = useContext(HomeContext);
  const [showOverlayLoader, setShowOverlayLoader] = useState(false);
  const formRef = useRef(null);

  const reset = () => {
    setOperators([]);
    setOperatories([]);
    setSlots([]);
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
        formRef.current.reset();
      } else {
        alert(`Appointment booking failed!\n${result.error}`);
      }
    } catch (error) {
      onError(error);
    }
  };

  const handlePatientTypeChange = () => reset();

  const handleFetchSlots = ({
    locationId,
    providerId,
    startDate,
    operatoryId,
  }) => {
    setShowOverlayLoader(true);

    const params = new URLSearchParams();
    params.append("locationId", locationId);
    params.append("providerId", providerId);
    params.append("startDate", startDate);
    params.append("operatoryId", operatoryId);

    apiGET({
      url: `${API}/appointments/slots?${params.toString()}`,
      onSuccess: (data) => {
        setShowOverlayLoader(false);
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
      reset();
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
            setOperatories((prev) => {
              const exists = prev.some((location) => location.id === data.id);
              if (!exists) {
                return prev.concat({
                  id: data.id,
                  name: data.name,
                  appt_categories: data.appt_categories,
                });
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
                name: provider.first_name + " " + provider.last_name,
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
    fetchData("appointment-categories");
  }, []);

  const apptCategories = useMemo(() => {
    const operatoriesFlat = operatories.flatMap(
      (operatory) => operatory.appt_categories
    );

    return removeDuplicates(operatoriesFlat);
  }, [operatories.length]);

  apptCategories.displayName = "apptCategories";

  return (
    <div className={styles.booking_container}>
      <AppointmentBookingForm
        patients={patients}
        providers={providers}
        operatories={operatories}
        operators={operators}
        apptCategories={apptCategories}
        onSubmit={onSubmit}
        onFetchSlots={handleFetchSlots}
        onProviderSelected={onProviderSelected}
        slots={slots}
        onPatientTypeChange={handlePatientTypeChange}
        ref={formRef}
      />
      {showOverlayLoader && <OverlayLoader />}
    </div>
  );
};

BookingContainer.displayName = "BookingContainer";

export { BookingContainer };
