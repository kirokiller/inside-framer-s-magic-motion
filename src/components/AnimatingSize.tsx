import { useLayoutEffect, useReducer, useRef } from "react";
import { animate } from "popmotion";
import styles from "./AnimatingSize.module.css";

/* tips: 仅用于研究，实际项目中请勿这样使用，建议使用transition动画 */

const finalWidth = 702;

function Motion({ toggled }: { toggled: boolean }) {
  const squareRef = useRef<HTMLDivElement>(null);
  const initialBoxRef = useRef<DOMRect>();

  useLayoutEffect(() => {
    const box = squareRef.current?.getBoundingClientRect();
    if (changed(initialBoxRef.current, box)) {
      // revert
      /* 原文此处应是不对的 */
      const deltaWidth = initialBoxRef.current!.width / box!.width;
      squareRef.current!.style.transform = `scaleX(${deltaWidth})`;

      animate({
        from: deltaWidth,
        to: 1,
        duration: 2000,
        onUpdate: (progress) => {
          /* 在css设置transform-origin */
          squareRef.current!.style.transform = `scaleX(${progress})`;
        },
      });
    }
    initialBoxRef.current = box;
  });

  return (
    <div
      className={styles.motion}
      ref={squareRef}
      style={toggled ? { width: finalWidth } : {}}
    />
  );
}

const changed = (initialBox?: DOMRect, finalBox?: DOMRect) => {
  if (!initialBox || !finalBox) return false;

  return JSON.stringify(initialBox) !== JSON.stringify(finalBox);
};

export default function AnimatingSizeDemo() {
  const [toggled, toggle] = useReducer((state) => !state, false);

  return (
    <div>
      <h3>Animating Size</h3>
      <button onClick={toggle}>Toggle</button>
      <div className={styles.wrapper}>
        <Motion toggled={toggled} />
      </div>
    </div>
  );
}
