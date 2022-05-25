import React from "react";
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
}) => {
  return (
    <>
      {/* provider */}
      <div className={commonStyles.form_field}>
        <Select
          label="Provider"
          options={providers}
          onChange={handleProviderSelection}
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
          hideHead
          // fromDate={new Date()}
          disabled={{
            dayOfWeek: [0, 6],
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
