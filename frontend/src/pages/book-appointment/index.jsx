import { default as dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [availabilities, setAvailabilities] = useState([]);
  const [operatories, setOperatories] = useState([]);

  const [availOperatories, setAvailOperatories] = useState([]);

  const [slots, setSlots] = useState([]);
  const { onError } = useContext(HomeContext);
  const [showOverlayLoader, setShowOverlayLoader] = useState(false);
  const formRef = useRef(null);

  const reset = () => {
    setAvailabilities([]);
    setSlots([]);
    setAvailOperatories([]);
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
          setAvailabilities(data);
        },
        onError,
      });
    } catch (error) {
      setShowOverlayLoader(false);
      onError(error);
    }
  };

  const onCategorySelected = useCallback(
    (categoryId) => {
      try {
        const selected = availabilities
          .filter((avail) =>
            avail.appointment_types.some((type) => type.id === +categoryId)
          )
          .map((avail) => avail.operatory_id);

        const deDupedOperatories = [...new Set(selected)];

        setAvailOperatories(deDupedOperatories);
      } catch (error) {
        setShowOverlayLoader(false);
        onError(error);
      }
    },
    [operatories.length, availabilities.length]
  );

  const filteredOperatories = useMemo(() => {
    return operatories.filter(
      (operatory) => availOperatories.indexOf(operatory.id) > -1
    );
  }, [JSON.stringify(availOperatories), operatories.length]);

  // on load fetch the patients, providers and, operatories
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
          } else if (type === "operatories") {
            setOperatories(data);
          }
        },
        onError,
      });
    };

    // fetch patients, providers
    fetchData("patients");
    fetchData("providers");
    fetchData("operatories");
  }, []);

  const apptCategories = useMemo(() => {
    const operatoriesFlat = availabilities.flatMap(
      (availability) => availability.appointment_types
    );

    return removeDuplicates(operatoriesFlat);
  }, [availabilities.length]);

  apptCategories.displayName = "apptCategories";

  return (
    <div className={styles.booking_container}>
      <AppointmentBookingForm
        patients={patients}
        providers={providers}
        operatories={filteredOperatories}
        availabilities={availabilities}
        apptCategories={apptCategories}
        onSubmit={onSubmit}
        onFetchSlots={handleFetchSlots}
        onProviderSelected={onProviderSelected}
        onCategorySelected={onCategorySelected}
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
