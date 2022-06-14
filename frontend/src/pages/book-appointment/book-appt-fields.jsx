import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import commonStyles from "../../common-styles/common.module.css";
import { Select } from "../../components/select";

const Fields = React.forwardRef((props, ref) => {
  const {
    apptCategories = [],
    disabledDays = [],
    handleApptCategorySelection,
    handleDateSelection,
    handleNotesChange,
    handleOperatorySelection,
    handleProviderSelection,
    handleSlotSelection,
    operatories = [],
    patientType,
    providers = [],
    slots = [],
  } = props;

  const locationRef = useRef(null);
  const providerRef = useRef(null);
  const apptCategoryRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const resetFields = () => {
    setSelectedDay(null);
    locationRef.current.reset();
    providerRef.current.reset();
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      resetFields();
    },
  }));

  useEffect(() => {
    //reset
    resetFields();
  }, [patientType]);

  return (
    <>
      {/* provider */}
      <div className={commonStyles.form_field}>
        <Select
          label="Provider"
          options={providers}
          onChange={(ev) => {
            locationRef.current.reset();
            handleProviderSelection(ev);
          }}
          id="provider"
          placeholder="Select a provider"
          ref={providerRef}
        />
      </div>

      {/* operatories */}
      <div className={commonStyles.form_field}>
        <Select
          label="Operatory"
          options={operatories}
          onChange={handleOperatorySelection}
          id="operatory"
          placeholder="Select a Operatory"
          ref={locationRef}
        />
      </div>

      <div className={commonStyles.form_field}>
        <Select
          label="Appointment Category"
          options={apptCategories}
          onChange={handleApptCategorySelection}
          id="appt-category"
          placeholder="Select a Appointment Category"
          ref={apptCategoryRef}
        />
      </div>

      {/* provider */}
      <div className={commonStyles.form_field}>
        <label className={commonStyles.label} htmlFor="provider">
          Choose a date
        </label>
        <DayPicker
          onDayClick={handleDateSelection}
          mode="single"
          disabled={[
            {
              dayOfWeek: disabledDays,
            },
            {
              before: new Date(),
            },
          ]}
          selected={selectedDay}
          onSelect={setSelectedDay}
        />
      </div>

      <div className={commonStyles.form_field}>
        <Select
          label="Slot"
          options={slots}
          onChange={handleSlotSelection}
          id="slot"
          placeholder="Select a slot"
        />
      </div>

      <div className={commonStyles.form_field}>
        <label className={commonStyles.label} htmlFor="notes">
          Note
        </label>
        <textarea
          className={commonStyles.textarea}
          id="notes"
          onChange={handleNotesChange}
        />
      </div>
    </>
  );
});

export { Fields };
