// Influenced by
// https://github.com/project-cemetery/react-timeline-scribble
import styles from "../styles/vertical.module.css";

export const VerticalTimeline = ({ children }) => (
  <div className={styles.container}>
    <ul className={`${styles.timeline} ${styles.contained}`}>{children}</ul>
  </div>
);

export const Interval = ({ interval, children }) => (
  <li className={styles.event}>
    <label className={`${styles.icon} ${styles.contained}`}></label>
    <div className={`${styles.body} ${styles.contained}`}>
      <p className={`${styles.date} ${styles.contained}`}>{interval}</p>
      <div className={`${styles.separator} ${styles.contained}`}></div>
      {children}
    </div>
  </li>
);
