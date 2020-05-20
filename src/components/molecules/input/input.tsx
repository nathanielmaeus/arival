import * as React from "react";
import cls from "classnames";
import styles from "./input.scss";
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
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
  register: FormContextValues["register"];
  isError: boolean;
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
  register,
  isError,
}) => {
  const [localValue, setValue] = React.useState<string>("");

  React.useEffect(() => {
    setValue(value);
  }, [value]);

  const handleOnKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleOnEnter(event);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange && onChange(event.target.value);
  };

  const handleOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) =>
    onEnter && onEnter(event.currentTarget.value);

  return (
    <>
      <label htmlFor={id}>{name}</label>
      <input
        className={cls(className, styles.input, { [styles.isError]: isError })}
        id={id}
        name={name}
        type="text"
        value={localValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleChange}
        onKeyPress={handleOnKeyPress}
        ref={register({ required: true })}
      />
    </>
  );
};

export default Input;
