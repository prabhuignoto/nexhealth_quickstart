import React, { useContext, useEffect, useMemo, useState } from "react";
import { apiGET } from "../../api-helpers";
import { HomeContext } from "../../helpers/protected-route";
import styles from "../../styles/list.module.css";

const API = process.env.REACT_APP_API;

const ListItem = ({
  id,
  provider_id,
  onDeleteClick,
  details,
  operatoryDetails,
}) => {
  const [name, setName] = useState("");
  const { onError } = useContext(HomeContext);

  useEffect(() => {
    const getProviderDetails = async () => {
      try {
        apiGET(
          `${API}/providers/${provider_id}`,
          (data) => {
            setName(data.name);
          },
          onError
        );
      } catch (error) {
        onError(error);
      }
    };

    getProviderDetails();
  }, [provider_id]);

  const getText = (id, days, beginTime, endTime) =>
    `Available at <b>${operatoryDetails[id]}</b> on ${days.map((day) =>
      day.slice(0, 3)
    )} from ${beginTime} to ${endTime}`;

  const getAvailabilityContent = useMemo(
    () =>
      name && (
        <ul style={{ padding: 0, margin: 0 }}>
          {details.map(
            ({ days, operatory_id, timings: { beginTime, endTime } }, index) =>
              operatoryDetails[operatory_id] && (
                <li
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: getText(operatory_id, days, beginTime, endTime),
                  }}
                ></li>
              )
          )}
        </ul>
      ),
    [details.length, JSON.stringify(operatoryDetails), name]
  );

  return (
    getAvailabilityContent && (
      <li key={id} className={styles.item}>
        <div className={styles.item_field}>{name}</div>
        <div className={styles.item_field}>{getAvailabilityContent}</div>
        <div>
          <button onClick={() => onDeleteClick(details.map((det) => det.id))}>
            Delete
          </button>
        </div>
      </li>
    )
  );
};

export { ListItem };
