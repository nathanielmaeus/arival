import * as React from "react";

import { IArticle } from "src/types";
import styles from "./article.scss";
interface ITableComponentProps {
  article: IArticle;
  isFavourite: boolean;
}

const Row: React.FC<ITableComponentProps> = ({ article }) => {
  const date = new Date(article.webPublicationDate).toDateString();
  const hashUrl = btoa(article.id);

  return (
    <div key={article.id} className={styles.row}>
      <div className={styles.info}>
        <p>{date}</p>
        <p className={styles.source}>{article.sectionName}</p>
      </div>
      <div className={styles.title}>{article.webTitle}</div>
      <div className={styles.text}>{article.webTitle}</div>
      <a className={styles.link} href={`/news/${hashUrl}`}>
        Read more
      </a>
    </div>
  );
};

export default Row;
