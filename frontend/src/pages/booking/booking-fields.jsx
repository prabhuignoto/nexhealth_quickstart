import React, { useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Select } from "../../components/select";
import commonStyles from "../../styles/common.module.css";

const BookingFields = ({
  providers,
  slots,
  locations,
  handleDateSelection,
  handleNotesChange,
  handleSlotSelection,
  handleProviderSelection,
  handleLocationSelection,
  disabledDays = [],
}) => {
  const locationRef = useRef(null);

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
          disabled={{
            dayOfWeek: disabledDays,
          }}
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
};

export { BookingFields };
