import React, { useCallback, useEffect } from "react";
import { AvailabilitiesList } from "./availabilities-list";
import styles from "./availabilities.module.css";

const API = process.env.REACT_APP_API;

const Availabilities = () => {
  const [availabilities, setAvailabilities] = React.useState([]);

  const [refetch, setRefetch] = React.useState(0);

  useEffect(() => {
    const getData = async () => {
      const request = await fetch(`${API}/appointments/availabilities`, {
        credentials: "include",
        method: "GET",
      });

      const result = await request.json();

      if (result.code) {
        setAvailabilities(result.data);
      }
    };

    getData();
  }, [refetch]);

  const handleDelete = useCallback((id) => {
    const deleteAvailability = async () => {
      const request = await fetch(
        `${API}/appointments/delete-availability/${id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );

      const result = await request.json();

      if (result.code) {
        setRefetch(new Date().getMilliseconds());
      }
    };

    deleteAvailability();
  }, []);

  return (
    <div className={styles.availabilities}>
      <div className={styles.list_wrapper}>
        <AvailabilitiesList
          availabilities={availabilities}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export { Availabilities };
