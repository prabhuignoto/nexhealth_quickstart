import React from "react";
import { Loader } from "./loader";
import styles from "./loader.module.css";

const OverlayLoader = () => {
  return (
    <div className={styles.overlay_loader}>
      <div className={styles.loader_wrapper}>
        <Loader />
      </div>
    </div>
  );
};

export { OverlayLoader };
