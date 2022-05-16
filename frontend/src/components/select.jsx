import React from "react";
import styles from "./select.module.css";

const Select = ({ label, options = [], placeholder, id, onChange }) => {
  return (
    <>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select id={id} className={styles.select} onChange={onChange}>
        <option value="" disabled selected style={{ fontStyle: "italic" }}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
};

export { Select };
