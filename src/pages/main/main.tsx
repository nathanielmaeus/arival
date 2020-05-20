import * as React from "react";
import { useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { getQuery } from "src/getQuery";

import styles from "./main.scss";

import { useStore } from "src/store";

import { Articles } from "src/components/organisms/articles";
import { ErrorWrapper } from "src/components/molecules/error";
import { Slider } from "src/components/molecules/slider";
import { SourceForm } from "src/components/organisms/form";
import { IDataForm } from "src/components/organisms/form/source-form";

const Main: React.FC = () => {
  const location = useLocation();
  const query = getQuery(location);
  const { articles } = useStore();

  const [isOpen, setIsOpen] = React.useState(false);

  const getArticles = React.useCallback(
    (isMore?: boolean) => {
      articles.getArticles(query, isMore);
    },
    [articles, query]
  );

  React.useEffect(() => {
    getArticles();
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSubmit = (data: IDataForm) => {
    if (articles.form.step === 1) {
      articles.saveArticle(data);
      setIsOpen(false);
    }
    articles.saveForm(data);
    articles.nextStep(data);
  };

  const { statuses } = articles;

  return (
    <div className={styles.layout}>
      <ErrorWrapper error={statuses.articles.error}>
        <button onClick={handleOpen}>Создать</button>
        <Articles
          articles={articles.articles}
          isLoading={statuses.articles.isLoading}
          onEndedList={getArticles}
        />
        <Slider isOpen={isOpen}>
          <SourceForm onSubmit={handleSubmit} />
        </Slider>
        <Articles articles={articles.source.articles} isLoading={false} />
      </ErrorWrapper>
    </div>
  );
};

export default observer(Main);
