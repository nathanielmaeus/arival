import * as React from "react";
import cls from "classnames";

import styles from "./loading.scss";

function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.LoadingDots}>
        <span className={cls(styles.item, styles.itemFirst)} />
        <span className={cls(styles.item, styles.itemSecond)} />
        <span className={cls(styles.item, styles.itemThird)} />
      </div>
    </div>
  );
}

export default Loading;
