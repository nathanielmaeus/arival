import * as React from "react";
import { observer } from "mobx-react-lite";

import styles from "./article.scss";

import { ErrorWrapper } from "src/components/molecules/error";

const Article: React.FC = () => {
  React.useEffect(() => {
    //getArticles();
  }, []);

  return (
    <div className={styles.layout}>
      <ErrorWrapper error="">
        <h3>dfsfds</h3>
      </ErrorWrapper>
    </div>
  );
};

export default observer(Article);
