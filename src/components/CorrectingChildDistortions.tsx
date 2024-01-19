import React, { useLayoutEffect, useReducer, useRef } from "react";
import styles from "./CorrectingChildDistortions.module.css";
import { animate } from "popmotion";

function Motion({
  toggled,
  corrected,
  children,
}: {
  toggled: boolean;
  corrected: boolean;
  children: React.ReactNode;
}) {
  const squareRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const initialPositionRef = useRef<DOMRect>();

  useLayoutEffect(() => {
    const box = squareRef.current?.getBoundingClientRect();
    if (changed(initialPositionRef.current, box)) {
      const transform = invert(
        squareRef.current!,
        box!,
        initialPositionRef.current!
      );

      animate({
        from: transform,
        to: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
        duration: 1000,
        onUpdate: ({ x, y, scaleX, scaleY }) => {
          squareRef.current!.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX}) scaleY(${scaleY})`;
          if (corrected) {
            childRef.current!.style.transform = `scaleX(${1 / scaleX}) scaleY(${
              1 / scaleY
            })`;
          }
        },
      });
    }
    initialPositionRef.current = box;
  });

  const motionStyle: React.CSSProperties = {
    aspectRatio: "initial",
    height: 120,
  };

  if (toggled) {
    motionStyle.width = "100%";
  }

  return (
    <div className={styles.motion} ref={squareRef} style={motionStyle}>
      <div ref={childRef}>{children}</div>
    </div>
  );
}

const changed = (initialBox?: DOMRect, finalBox?: DOMRect) => {
  // we just mounted, so we don't have complete data yet
  if (!initialBox || !finalBox) return false;

  // deep compare the two boxes
  return JSON.stringify(initialBox) !== JSON.stringify(finalBox);
};

const invert = (el: HTMLDivElement, from: DOMRect, to: DOMRect) => {
  const { x: fromX, y: fromY, width: fromWidth, height: fromHeight } = from;
  const { x, y, width, height } = to;

  const transform = {
    x: x - fromX - (fromWidth - width) / 2,
    y: y - fromY - (fromHeight - height) / 2,
    scaleX: width / fromWidth,
    scaleY: height / fromHeight,
  };

  el.style.transform = `translate(${transform.x}px, ${transform.y}px) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`;

  return transform;
};

export default function CorrectingChildDistortionsDemo() {
  const [toggled, toggle] = useReducer((state) => !state, false);
  const [corrected, toggleCorrected] = useReducer((state) => !state, false);

  return (
    <div>
      <h3>Correcting Child Distortions</h3>
      <div>
        <button onClick={toggle}>Toggle</button>
        <label>
          <input
            type="checkbox"
            checked={corrected}
            onChange={toggleCorrected}
          />
          Corrected
        </label>
      </div>
      <div className={styles.wrapper} style={{ justifyContent: "center" }}>
        <Motion toggled={toggled} corrected={corrected}>
          Hello!
        </Motion>
      </div>
    </div>
  );
}
