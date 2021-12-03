import { FC, useState } from "react";
import styles from "../styles/copy.module.css";
import { FiCopy, FiCheckSquare } from "react-icons/fi";

export const CopyLinkBtn: FC<{}> = () => {
  const [showCheck, setShowCheck] = useState(false);

  const handleClick = () => {
    if (showCheck) {
      return;
    }

    navigator.clipboard.writeText(window.location.href);
    setShowCheck(true);

    setTimeout(() => {
      setShowCheck(false);
    }, 2 * 1000);
  };

  const icon = showCheck ? (
    <FiCheckSquare className={styles.icon} />
  ) : (
    <FiCopy className={styles.icon} />
  );

  return (
    <button className={styles.btn} onClick={handleClick}>
      Copy Link {icon}
    </button>
  );
};
