import * as React from "react";
// import cls from "classnames";

import { IArticle } from "src/types";

import styles from "./article.scss";

interface ITableComponentProps {
  article: IArticle;
  isFavourite: boolean;
}

const Row: React.FC<ITableComponentProps> = ({ article }) => {
  const date = new Date(article.publishedAt).toDateString();

  return (
    <div key={article.url} className={styles.row}>
      <div className={styles.info}>
        <p>{date}</p>
        <p className={styles.source}>{article.source.name}</p>
      </div>
      <div className={styles.title}>{article.title}</div>
      <div className={styles.text}>{article.description}</div>
      <a className={styles.link} href={article.url}>
        Read more
      </a>
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          className={styles.img}
          alt={article.title}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default Row;
