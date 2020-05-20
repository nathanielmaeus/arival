import * as React from "react";
import cls from "classnames";

import styles from "./button.scss";

interface IButtonProps {
  onClick?: (v: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type: "submit" | "reset" | "button";
}

function Button({
  type,
  onClick,
  children,
  className,
}: React.PropsWithChildren<IButtonProps>) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e);
  };
  return (
    <button
      className={cls(className, styles.button)}
      onClick={handleClick}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
