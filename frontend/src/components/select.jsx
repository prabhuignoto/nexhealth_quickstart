import classNames from "classnames";
import React, { useImperativeHandle, useRef } from "react";
import styles from "./select.module.css";

const Select = React.forwardRef((props, ref) => {
  const {
    label,
    options = [],
    placeholder,
    id,
    onChange,
    children,
    multiple = false,
  } = props;
  const selectRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      selectRef.current.selectedIndex = 0;
    },
  }));

  return (
    <>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        className={classNames(styles.select, multiple ? styles.multiple : "")}
        onChange={onChange}
        defaultValue={!multiple ? "placeholder" : [0]}
        ref={selectRef}
        multiple={multiple}
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
});

export { Select };
