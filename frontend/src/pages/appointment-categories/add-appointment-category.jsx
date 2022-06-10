import classNames from "classnames";
import { useMemo, useState } from "react";
import commonStyles from "../../styles/common.module.css";
import { postData } from "../../utils";
import styles from "./add-appointment-category.module.css";

const AddAppointmentCategory = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [minutes, setMinutes] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleMinutesChange = (e) => setMinutes(e.target.value);

  const canSubmit = useMemo(
    () => name && category && minutes,
    [name, category, minutes]
  );

  const submitData = async (data) => {
    try {
      const request = await postData(
        `${process.env.REACT_APP_API}/appointment-categories`,
        data
      );

      const result = await request.json();

      if (result.code) {
        alert("Appointment category added successfully!");
      } else {
        alert(`Appointment category creation failed!\n${result.error}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateCategory = (ev) => {
    ev.preventDefault();
    if (canSubmit) {
      const payload = {
        appointment_category: {
          name,
          category,
          minutes: +minutes,
          parent_type: "Institution",
          bookable_online: true,
        },
      };
      submitData(payload);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={commonStyles.form}>
        <div className={commonStyles.form_field}>
          <label htmlFor="category-name">Name</label>
          <input
            type="text"
            className={commonStyles.input}
            aria-label="name"
            id="category-name"
            onChange={handleNameChange}
          />
        </div>
        <div className={commonStyles.form_field}>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            className={commonStyles.input}
            aria-label="category"
            onChange={handleCategoryChange}
          />
        </div>
        <div className={commonStyles.form_field}>
          <label htmlFor="description">Minutes</label>
          <input
            type="number"
            className={commonStyles.input}
            aria-label="minutes"
            onChange={handleMinutesChange}
          />
        </div>
        <div className={commonStyles.controls}>
          <button
            className={classNames(
              commonStyles.button,
              !canSubmit ? commonStyles.disabled : ""
            )}
            onClick={handleCreateCategory}
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export { AddAppointmentCategory };
