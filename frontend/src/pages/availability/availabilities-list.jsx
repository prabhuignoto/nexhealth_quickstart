import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/list.module.css";
import { getData } from "../../utils";
import { ListItem } from "./availability-list-item";

const API = process.env.REACT_APP_API;

const AvailabilitiesList = ({ availabilities = [], onDelete }) => {
  const queriedOperatories = useRef({});

  // console.log(availabilities);

  const [operatoriesDetails, setOperatoriesDetails] = useState({});

  const onDeleteClick = (ids) => {
    window.confirm("Are you sure you want to delete this availability?") &&
      onDelete(ids);
  };

  const getOperatoryDetails = useCallback(async (id) => {
    const result = await getData(`${API}/operatories/${id}`);
    const operatory = await result.json();

    if (operatory.code) {
      setOperatoriesDetails((prev) => ({ ...prev, [id]: operatory.data.name }));
    }
  }, []);

  useEffect(() => {
    if (availabilities.length) {
      availabilities.forEach((availability) => {
        availability.details.forEach((detail) => {
          const { operatory_id } = detail;

          if (!(operatory_id in queriedOperatories.current)) {
            queriedOperatories.current[operatory_id] = null;
            getOperatoryDetails(operatory_id);
          }
        });
      });
    }
  }, [availabilities.length]);

  return (
    <>
      {availabilities.length > 0 && (
        <ul className={styles.list}>
          {/* headers */}
          <li className={styles.list_headers}>
            <div className={styles.list_header}>Name</div>
            <div className={styles.list_header}>Availability</div>
            <div></div>
          </li>

          {/* availabilities */}
          {availabilities.map((availability) => (
            <ListItem
              {...availability}
              onDeleteClick={onDeleteClick}
              key={availability.id}
              operatoryDetails={operatoriesDetails}
              availabilityDetails={availability.details}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export { AvailabilitiesList };
