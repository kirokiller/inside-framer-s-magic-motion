import { useLayoutEffect, useReducer, useRef } from "react";
import { animate } from "popmotion";
import styles from "./IntroducingFLIP.module.css";

const moved = (initialBox?: DOMRect, finalBox?: DOMRect) => {
  // we just mounted, so we don't have complete data yet
  if (!initialBox || !finalBox) return false;

  const xMoved = initialBox.x !== finalBox.x;
  const yMoved = initialBox.y !== finalBox.y;

  return xMoved || yMoved;
};

function Motion() {
  const squareRef = useRef<HTMLDivElement>(null);
  const initialPositionRef = useRef<DOMRect>();

  useLayoutEffect(() => {
    const box = squareRef.current?.getBoundingClientRect();
    if (moved(initialPositionRef.current, box)) {
      // get the difference in position
      const deltaX = initialPositionRef.current!.x - box!.x;
      const deltaY = initialPositionRef.current!.y - box!.y;
      console.log(deltaX, deltaY);

      // apply the transform to the box
      squareRef.current!.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      // animate back to the final position
      animate({
        from: 1,
        to: 0,
        duration: 2000,
        onUpdate: (progress) => {
          squareRef.current!.style.transform = `translate(${
            deltaX * progress
          }px, ${deltaY * progress}px)`;
        },
      });
    }

    initialPositionRef.current = box;
  });

  return <div className={styles.motion} ref={squareRef} />;
}

export default function IntroducingFLIPDemo() {
  const [toggled, toggle] = useReducer((state) => !state, false);

  return (
    <div>
      <h3>Introducing FLIP</h3>
      <button onClick={toggle}>Toggle</button>
      <div
        className={styles.wrapper}
        style={{ justifyContent: toggled ? "flex-end" : "flex-start" }}
      >
        <Motion />
      </div>
    </div>
  );
}
