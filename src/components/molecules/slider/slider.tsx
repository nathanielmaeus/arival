import * as React from "react";

import { observer } from "mobx-react-lite";
import { CSSTransition } from "react-transition-group";
import styles from "./slider.scss";

interface ISliderComponentProps {
  isOpen?: boolean;
  onClose: () => void;
}

const Slider: React.FC<ISliderComponentProps> = ({
  children,
  isOpen = false,
  onClose,
}) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(isOpen);
  const sliderRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && !sliderRef?.current?.contains(event.target as Node)) {
        handleClose();
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  React.useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <div className={styles.back} ref={sliderRef}>
      <CSSTransition
        in={isVisible}
        timeout={200}
        unmountOnExit
        classNames={{
          ...styles,
        }}
      >
        <section className={styles.wrapper}>
          <span className={styles.close} onClick={handleClose}>
            ×
          </span>
          {children}
        </section>
      </CSSTransition>
    </div>
  );
};

export default observer(Slider);
