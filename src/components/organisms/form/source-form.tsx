import * as React from "react";
import { useForm } from "react-hook-form";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import styles from "./source-form.scss";
import { useStore } from "src/store";
import { observer } from "mobx-react-lite";
import { Button } from "src/components/molecules/button";
import { Input } from "src/components/molecules/input";
import { Textarea } from "src/components/molecules/textarea";

export interface IDataFormFirstStep {
  headline: string;
  sourceMedia: string;
  url: string;
  author: string;
}

export interface IDataFormSecondStep {
  text: string;
}

export type IDataForm = IDataFormSecondStep & IDataFormFirstStep;

const SourceFrom: React.FC<{ onSubmit: (data: IDataForm) => void }> = observer(
  ({ onSubmit }) => {
    const { register, handleSubmit, errors } = useForm<IDataForm>();
    const { articles } = useStore();

    const renderFirstStep = () => (
      <fieldset className={styles.block}>
        <Input
          id="sourceMedia"
          name="sourceMedia"
          placeholder="sourceMedia"
          register={register}
          isError={Boolean(errors.sourceMedia)}
        />
        <Input
          id="Headline"
          name="headline"
          placeholder="Headline"
          register={register}
          isError={Boolean(errors.headline)}
        />
        <Input
          id="author"
          name="author"
          placeholder="Author"
          register={register}
          isError={Boolean(errors.author)}
        />
        <Input
          id="url"
          name="url"
          placeholder="Your website"
          register={register}
          isError={Boolean(errors.url)}
        />
      </fieldset>
    );

    const renderSecondStep = () => (
      <fieldset className={styles.block}>
        <Textarea
          id="Text"
          name="text"
          placeholder="Text"
          rows={20}
          register={register}
        />
      </fieldset>
    );

    const renderSteps = () => {
      console.log(articles.form.step);
      if (articles.form.step === 0) {
        return renderFirstStep();
      }
      return renderSecondStep();
    };

    const renderStepFields = () => (
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={articles.form.step}
          classNames={{ ...styles }}
          timeout={250}
        >
          <div className={styles.block}>{renderSteps()}</div>
        </CSSTransition>
      </SwitchTransition>
    );

    return (
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h3>Create your news</h3>
        {renderStepFields()}
        <Button type="submit" className={styles.submitButton}>Continue</Button>
      </form>
    );
  }
);

export default SourceFrom;
