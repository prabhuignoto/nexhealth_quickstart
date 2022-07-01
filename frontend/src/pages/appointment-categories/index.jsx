import { useContext, useEffect, useState } from "react";
import { apiDELETE, apiGET } from "../../api-helpers";
import listStyles from "../../common-styles/list.module.css";
import { Loader } from "../../components/loader";
import { HomeContext } from "../../helpers/protected-route";
import TrashIcon from "../../icons/trash";
import styles from "./styles.module.css";

const AppointmentCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { onError } = useContext(HomeContext);

  const loadData = () => {
    setIsLoadingData(true);
    apiGET({
      url: `${process.env.REACT_APP_API}/appointment-categories`,
      onSuccess: (data) => {
        setIsLoadingData(false);
        setCategories(data);
      },
      onError: () => {
        setIsLoadingData(false);
        onError();
      },
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const onDelete = (id) => {
    if (id) {
      apiDELETE({
        url: `${process.env.REACT_APP_API}/appointment-categories/${id}`,
        onSuccess: (data) => {
          loadData();
        },
        onError,
      });
    }
  };

  return (
    <CategoriesList
      items={categories}
      onDelete={onDelete}
      isLoadingData={isLoadingData}
    />
  );
};

const CategoriesList = ({ items, onDelete, isLoadingData }) => {
  const handleDelete = (id) => {
    window.confirm("Are you sure you want to delete this category?") &&
      onDelete(id);
  };

  return (
    <div className={styles.wrapper}>
      {items.length > 0 && !isLoadingData && (
        <ul className={listStyles.list}>
          <li className={styles.headers}>
            <div className={styles.grid_header_cell}>Name</div>
            <div className={styles.grid_header_cell}>Parent Type</div>
            <div className={styles.grid_header_cell}>Minutes</div>
            <div className={styles.grid_header_cell}></div>
          </li>

          {items.map(({ id, parent_type, minutes, name }) => (
            <li key={id} className={styles.row}>
              <div className={styles.grid_cell}>{name}</div>
              <div className={styles.grid_cell}>{parent_type}</div>
              <div className={styles.grid_cell}>{minutes}</div>
              <div className={styles.grid_cell}>
                <button
                  className={styles.button}
                  onClick={() => handleDelete(id)}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {isLoadingData && (
        <div className={styles.loader_wrapper}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export { AppointmentCategories };
