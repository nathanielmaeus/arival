import * as React from "react";
import styles from "./textarea.scss";
import { FormContextValues } from "react-hook-form";

export interface ICallbackObject {
  value: string;
}

interface IInputProps {
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
  register: FormContextValues["register"];
}

const Input: React.SFC<IInputProps> = ({
  id,
  name,
  value = "",
  placeholder,
  disabled,
  onChange,
  onEnter,
  className,
  rows,
  register,
}) => {
  const [localValue, setValue] = React.useState<string>("");

  React.useEffect(() => {
    setValue(value);
  }, [value]);

  const handleOnKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      handleOnEnter(event);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;

    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";

    setValue(value);
    onChange && onChange(value);
  };

  const handleOnEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) =>
    onEnter && onEnter(event.currentTarget.value);

  return (
    <textarea
      className={styles.textarea}
      rows={rows}
      id={id}
      name={name}
      value={localValue}
      placeholder={placeholder}
      disabled={disabled}
      onChange={handleChange}
      onKeyPress={handleOnKeyPress}
      ref={register({ required: true })}
    />
  );
};

export default Input;
