import React, { useEffect, useState } from "react";
import { Loader } from "../../components/loader";
import { FAILURE_MESSAGES } from "../../messages";
import { getData } from "../../utils";
import { AvailabilitiesList } from "./availabilities-list";
import styles from "./availabilities.module.css";

const API = process.env.REACT_APP_API;

function parseData(data) {
  const parsedResult = {};

  data.forEach((item) => {
    const providerId = item.provider_id;

    if (parsedResult[providerId]) {
      const curObject = parsedResult[providerId];
      parsedResult[providerId] = {
        ...curObject,
        details: curObject.details.concat({
          ...item,
          timings: {
            beginTime: item.begin_time,
            endTime: item.end_time,
          },
        }),
      };
    } else {
      parsedResult[providerId] = {
        ...item,
        details: [
          {
            ...item,
            timings: {
              beginTime: item.begin_time,
              endTime: item.end_time,
            },
          },
        ],
      };
    }
  });

  return Object.keys(parsedResult).map((key) => parsedResult[key]);
}

const Availabilities = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        setIsLoadingData(true);
        const request = await getData(`${API}/availabilities`);
        const result = await request.json();

        if (result.code) {
          setIsLoadingData(false);
          setAvailabilities(parseData(result.data));
        }
      } catch (error) {
        console.log(error);
        setIsLoadingData(false);
        window.alert(FAILURE_MESSAGES.SERVER_DOWN);
      }
    };

    fetchAvailabilities();
  }, [refetch]);

  const handleDelete = (ids) => {
    try {
      const deleteAvailability = async (id) => {
        const request = await fetch(`${API}/availabilities/delete/${id}`, {
          credentials: "include",
          method: "DELETE",
        });

        const result = await request.json();

        if (result.code) {
          setRefetch(new Date().getMilliseconds());
        }
      };

      ids.forEach((id) => deleteAvailability(id));
    } catch (error) {
      console.log(error);
      window.alert("Failed to delete availability");
    }
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

