import { useContext, useEffect, useMemo, useState } from "react";
import { apiGET } from "../../api-helpers";
import styles from "../../common-styles/list.module.css";
import { HomeContext } from "../../helpers/protected-route";
import TrashIcon from "../../icons/trash";
import availabilityStyles from "./styles.module.css";

const API = process.env.REACT_APP_API;

const ListItem = ({
  id,
  provider_id,
  onDeleteClick,
  details,
  operatoryDetails,
}) => {
  const [name, setName] = useState("");
  const { onError } = useContext(HomeContext);

  useEffect(() => {
    const getProviderDetails = async () => {
      try {
        apiGET({
          url: `${API}/providers/${provider_id}`,
          onSuccess: (data) => {
            setName(data.name);
          },
          onError,
        });
      } catch (error) {
        onError(error);
      }
    };

    getProviderDetails();
  }, [provider_id]);

  const getAvailabilityContent = useMemo(
    () =>
      name && (
        <ul style={{ padding: 0, margin: 0 }}>
          <li className={availabilityStyles.grid_item}>
            <div className={availabilityStyles.grid_cell}>Operatory</div>
            <div className={availabilityStyles.grid_cell}>Days</div>
            <div className={availabilityStyles.grid_cell}>Timings</div>
            <div className={availabilityStyles.grid_cell}>
              Appointment Category
            </div>
            <div className={availabilityStyles.grid_cell}></div>
          </li>
          {details.map(
            (
              { days, operatory_id, timings: { beginTime, endTime }, id },
              index
            ) =>
              operatoryDetails[operatory_id] && (
                <li key={id} className={availabilityStyles.grid_item}>
                  <div className={availabilityStyles.grid_cell}>
                    {operatoryDetails[operatory_id].name}
                  </div>
                  <div className={availabilityStyles.grid_cell}>
                    {days.map((day) => day.slice(0, 3)).join(", ")}
                  </div>
                  <div
                    className={availabilityStyles.grid_cell}
                  >{`${beginTime} - ${endTime}`}</div>
                  <div className={availabilityStyles.grid_cell}>
                    {operatoryDetails[operatory_id].appt_categories
                      .map((cat) => cat.name)
                      .join(", ")}
                  </div>
                  <div className={availabilityStyles.grid_cell}>
                    <button
                      onClick={() => onDeleteClick(id)}
                      className={availabilityStyles.delete_button_wrapper}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              )
          )}
        </ul>
      ),
    [details.length, JSON.stringify(operatoryDetails), name]
  );

  return (
    getAvailabilityContent && (
      <li key={id} className={styles.item}>
        <div className={styles.item_field}>{name}</div>
        <div className={styles.item_field}>{getAvailabilityContent}</div>
      </li>
    )
  );
};

export { ListItem };
