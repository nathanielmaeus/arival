import * as React from "react";

export const useAnimationFrame = (callback: Function): void => {
  const requestRef = React.useRef<number>(0);
  const previousTimeRef = React.useRef<number>(0);

  const animate = React.useCallback(
    (time: number): void => {
      if (previousTimeRef.current !== undefined) {
        callback();
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);
};

// export const useResize = (
//   callback: (el: Element) => void,
//   el: React.RefObject<HTMLDivElement>
// ): void => {
//   if (!el) {
//     return;
//   }
//   React.useEffect(() => {
//     const resizeObserver = new ResizeObserver((entries: Element[]) => {
//       for (const entry of entries) {
//         callback(entry);
//       }
//     });
//     resizeObserver.observe(el.current);
//   }, []);
// };
