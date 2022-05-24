import React, { useContext, useEffect, useState } from "react";
import { Loader } from "../../components/loader";
import { HomeContext } from "../../helpers/protected-route";
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
  const { onError } = useContext(HomeContext);

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
        setIsLoadingData(false);
        onError(error);
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
      onError(error);
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
