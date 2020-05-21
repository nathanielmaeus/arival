import * as React from "react";
import { observer } from "mobx-react-lite";
import { Link, useRouteMatch } from "react-router-dom";

import styles from "./article.scss";

import { ErrorWrapper } from "src/components/molecules/error";
import { useStore } from "src/store";

interface IRouteProps {
  id: string;
}
const Article: React.FC = () => {
  const { article: articleStore } = useStore();
  const match = useRouteMatch<IRouteProps>();

  React.useEffect(() => {
    articleStore.getArticle(atob(match.params.id));
  }, []);

  if (articleStore.statuses.isLoading) {
    return <div>Loading</div>;
  }

  if (!articleStore.article) {
    return <div>News is empty</div>;
  }

  const { article } = articleStore;

  return (
    <div className={styles.layout}>
      <ErrorWrapper error="">
        <div key={article.webUrl} className={styles.row}>
          <div className={styles.info}>
            <p className={styles.source}>{article.sectionName}</p>
          </div>
          <div className={styles.title}>{article.webTitle}</div>
          <div className={styles.text}>{article.webTitle}</div>
        </div>
        <Link className={styles.linkBack} to="/news">
          Back
        </Link>
      </ErrorWrapper>
    </div>
  );
};

export default observer(Article);
