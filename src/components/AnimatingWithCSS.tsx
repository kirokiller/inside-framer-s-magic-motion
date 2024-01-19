import { useReducer } from "react";
import styles from "./AnimatingWithCSS.module.css";
import clsx from "clsx";

function Motion({ toggled }: { toggled: boolean }) {
  return <div className={clsx(styles.active, { [styles.toggled]: toggled })} />;
}

export default function AnimatingWithCSSDemo() {
  const [toggled, toggle] = useReducer((state) => !state, false);

  return (
    <div>
      <h3>Animating With CSS</h3>
      <button onClick={toggle}>Toggle</button>
      <div className={styles.wrap}>
        <Motion toggled={toggled} />
        <div className={styles.square}></div>
        <div className={styles.square}></div>
      </div>
    </div>
  );
}
