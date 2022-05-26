import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Select } from "../../components/select";
import commonStyles from "../../styles/common.module.css";

const BookingFields = React.forwardRef((props, ref) => {
  const {
    providers,
    slots,
    locations,
    handleDateSelection,
    handleNotesChange,
    handleSlotSelection,
    handleProviderSelection,
    handleLocationSelection,
    disabledDays = [],
    patientType,
  } = props;

  const locationRef = useRef(null);
  const providerRef = useRef(null);
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

      {/* locations */}
      <div className={commonStyles.form_field}>
        <Select
          label="Location"
          options={locations}
          onChange={handleLocationSelection}
          id="location"
          placeholder="Select a location"
          ref={locationRef}
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

export { BookingFields };
