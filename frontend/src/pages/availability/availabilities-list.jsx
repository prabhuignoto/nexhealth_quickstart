import React, { useEffect, useState } from "react";
import styles from "../../styles/list.module.css";

const API = process.env.REACT_APP_API;

const ListItem = ({
  id,
  provider_id,
  begin_time,
  end_time,
  days,
  onDeleteClick,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const getProviderDetails = async () => {
      const result = await fetch(`${API}/providers/${provider_id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const provider = await result.json();

      if (provider.code) {
        setName(provider.data.name);
      }
    };

    getProviderDetails();
  }, []);

  return (
    <li key={id} className={styles.item}>
      <div className={styles.item_field}>{name}</div>
      <div className={styles.item_field}>{days.join(",")}</div>
      <div className={styles.item_field}>{begin_time}</div>
      <div className={styles.item_field}>{end_time}</div>
      <div>
        <button onClick={() => onDeleteClick(id)}>Delete</button>
      </div>
    </li>
  );
};

const AvailabilitiesList = ({ availabilities = [], onDelete }) => {
  const onDeleteClick = (id) => {
    window.confirm("Are you sure you want to delete this availability?") &&
      onDelete(id);
  };

  return (
    <>
      {availabilities.length > 0 && (
        <ul className={styles.list}>
          {/* headers */}
          <li className={styles.list_headers}>
            <div className={styles.list_header}>Name</div>
            <div className={styles.list_header}>Days</div>
            <div className={styles.list_header}>Begin Time</div>
            <div className={styles.list_header}>End Time</div>
            <div></div>
          </li>

          {/* availabilities */}
          {availabilities.map((availability) => (
            <ListItem
              {...availability}
              onDeleteClick={onDeleteClick}
              key={availability.id}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export { AvailabilitiesList };
