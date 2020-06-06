import * as React from "react";
import { observer } from "mobx-react-lite";

import styles from "./main.scss";

import { useStore } from "src/store";

import { Articles } from "src/components/organisms/articles";
import { ErrorWrapper } from "src/components/molecules/error";
import { Slider } from "src/components/molecules/slider";
import { SourceForm } from "src/components/organisms/form";
import { IDataForm } from "src/components/organisms/form/source-form";
import { Button } from "src/components/molecules/button";
import { Story } from "src/components/molecules/story";

const images = [
  { url: "1.jpg", title: "Oliver Tree: album release date" },
  { url: "2.jpg", title: "New actress: new talents in a cinema" },
  { url: "3.jpg", title: "Keia Magazine: new photos" },
];

const Main: React.FC = () => {
  const { articles: articlesStore } = useStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const getArticles = React.useCallback(
    (isMore?: boolean) => {
      articlesStore.getArticles(isMore);
    },
    [articlesStore]
  );

  React.useEffect(() => {
    if (articlesStore.articles.length !== 0) {
      return;
    }
    getArticles();
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (data: IDataForm) => {
    if (articlesStore.form.step === 1) {
      articlesStore.saveArticle(data);
      setIsOpen(false);
    }
    articlesStore.saveForm(data);
    articlesStore.nextStep();
  };

  const { statuses } = articlesStore;

  return (
    <div className={styles.layout}>
      <ErrorWrapper error={statuses.articles.error}>
        <Story className={styles.story} images={images} />
        <Button
          className={styles.createButton}
          type="button"
          onClick={handleOpen}
        >
          Create
        </Button>
        <Articles
          articles={articlesStore.articles}
          isLoading={statuses.articles.isLoading}
          onEndedList={getArticles}
        />
        <Slider isOpen={isOpen} onClose={handleClose}>
          <SourceForm onSubmit={handleSubmit} />
        </Slider>
      </ErrorWrapper>
    </div>
  );
};

export default observer(Main);
