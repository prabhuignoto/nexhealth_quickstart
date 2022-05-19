import React, { useEffect, useState } from "react";
import { getData } from "../../utils";
import { AvailabilitiesList } from "./availabilities-list";
import styles from "./availabilities.module.css";

const API = process.env.REACT_APP_API;

const Availabilities = () => {
  const [availabilities, setAvailabilities] = useState([]);

  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const request = await getData(`${API}/availabilities`);

        const result = await request.json();

        if (result.code) {
          setAvailabilities(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAvailabilities();
  }, [refetch]);

  const handleDelete = (id) => {
    const deleteAvailability = async () => {
      const request = await fetch(`${API}/availabilities/delete/${id}`, {
        credentials: "include",
        method: "DELETE",
      });

      const result = await request.json();

      if (result.code) {
        setRefetch(new Date().getMilliseconds());
      }
    };

    deleteAvailability();
  };

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
