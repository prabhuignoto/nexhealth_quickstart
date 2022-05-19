import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Loader } from "../../components/loader";
import { apiState } from "../../state";
import { getData } from "../../utils";
import { FAILURE_MESSAGES } from "../../messages";
import { AvailabilitiesList } from "./availabilities-list";
import styles from "./availabilities.module.css";

const API = process.env.REACT_APP_API;

const Availabilities = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [refetch, setRefetch] = useState(0);
  const setApiState = useSetRecoilState(apiState);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        setIsLoadingData(true);
        const request = await getData(`${API}/availabilities`);

        const result = await request.json();

        if (result.code) {
          setIsLoadingData(false);
          setAvailabilities(result.data);
        }
      } catch (error) {
        console.log(error);
        setIsLoadingData(false);
        setApiState({
          failed: true,
          message: FAILURE_MESSAGES.SERVER_DOWN,
        });
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
        {isLoadingData ? (
          <div className={styles.loader_wrapper}>
            <Loader />
          </div>
        ) : (
          <AvailabilitiesList
            availabilities={availabilities}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export { Availabilities };
