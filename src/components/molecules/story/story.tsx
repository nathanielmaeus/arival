import * as React from "react";
import { useAnimationFrame } from "./hooks";
import cls from "classnames";

import styles from "./story.scss";
import { throttle } from "./helpers";

const MAX_PROCENT = 100;
const DEFAULT_WIDTH = 919;
const DEFAULT_SPEED = 20;
const ORDER_LIST = [1, 2, 3];

export interface ISliderProps {
  images: { url: string; title: string }[];
  className?: string;
  speed?: number;
}

const Slider: React.FC<ISliderProps> = ({
  images,
  className,
  speed = DEFAULT_SPEED,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const around = React.useRef<boolean>(false);

  const [position, setPosition] = React.useState<number>(0);
  const [time, setTime] = React.useState<number>(0);
  const [coverWidth, setCoverWidth] = React.useState<number>(DEFAULT_WIDTH);

  const [progressList, setProgressList] = React.useState([0, 0, 0]);

  useAnimationFrame(() => {
    setTime((prevCount) => (prevCount + speed * 0.01) % MAX_PROCENT);
  });

  const changePosition = React.useCallback(
    (time = MAX_PROCENT) => {
      if (position === images.length - 1) {
        setProgressList([0, 0, 0]);
        setPosition(0);
      } else {
        setPosition((e) => e + 1);
        setProgressList((e) => [
          ...e.slice(0, position),
          Math.round(time),
          ...e.slice(position + 1),
        ]);
      }
    },
    [position, images]
  );

  React.useEffect(() => {
    if (Math.round(time) === MAX_PROCENT && !around.current) {
      changePosition(time);
      around.current = true;
      return;
    }
    if (Math.round(time) !== MAX_PROCENT) {
      around.current = false;
    }

    setProgressList((e) => [
      ...e.slice(0, position),
      time,
      ...e.slice(position + 1),
    ]);
  }, [time, position, images, changePosition]);

  React.useEffect(() => {
    function handleResize(): void {
      setCoverWidth(containerRef.current!.offsetWidth + 2);
    }

    const throttledResize = throttle(handleResize);

    handleResize();

    window.addEventListener("resize", throttledResize);
    return () => {
      window.removeEventListener("resize", throttledResize);
    };
  }, []);

  const handleClick = (): void => {
    changePosition();
    setTime(0);
  };

  const renderTabs = (): React.ReactElement => (
    <div className={styles.tabs}>
      {images.map(({ url }, index) => (
        <div className={styles.tab} key={url}>
          <div
            className={styles.progress}
            style={{ width: `${progressList[index]}%` }}
          />
        </div>
      ))}
    </div>
  );

  const renderCanvas = (): React.ReactElement => (
    <div
      className={styles.canvas}
      style={{ transform: `translateX(-${position * coverWidth}px)` }}
    >
      {images.map(({ url, title }, index) => (
        <div
          className={styles.cover}
          key={url}
          style={{ order: ORDER_LIST[index], width: `${coverWidth}px` }}
        >
          <h3 className={styles.title}>{title}</h3>
          <img
            className={styles.img}
            src={require(`src/public/assets/${url}`)}
          ></img>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={cls(className, styles.wrapper)}
      ref={containerRef}
      onClick={handleClick}
    >
      {renderTabs()}
      {renderCanvas()}
    </div>
  );
};

export default Slider;
