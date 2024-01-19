import { useLayoutEffect, useReducer, useRef } from "react";
// import { animate } from "popmotion";
import styles from "./AnimatingSize.module.css";

/* tips: 仅用于研究，实际项目中请勿这样使用，建议使用transition动画 */

const finalWidth = 702;

function Motion({ toggled }: { toggled: boolean }) {
  const squareRef = useRef<HTMLDivElement>(null);
  const initialBoxRef = useRef<DOMRect>();

  useLayoutEffect(() => {
    const box = squareRef.current?.getBoundingClientRect();
    /* 
      补充实现 
    */
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

export default function ConsolidatingSizeWithPositionDemo() {
  const [toggled, toggle] = useReducer((state) => !state, false);

  return (
    <div>
      <h3>ConsolidatingSizeWithPosition</h3>
      <button onClick={toggle}>Toggle</button>
      <div
        className={styles.wrapper}
        style={{ justifyContent: toggled ? "flex-end" : "flex-start" }}
      >
        <Motion toggled={toggled} />
      </div>
    </div>
  );
}
