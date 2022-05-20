import React from "react";
import styles from "./select.module.css";

const Select = ({
  label,
  options = [],
  placeholder,
  id,
  onChange,
  children,
}) => {
  return (
    <>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        className={styles.select}
        onChange={onChange}
        defaultValue={"placeholder"}
      >
        <option
          value="placeholder"
          disabled
          style={{ fontStyle: "italic" }}
          key="placeholder"
        >
          {placeholder}
        </option>
        {children}
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
