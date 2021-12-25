import { FC } from "react";
import { GiProtectionGlasses } from "react-icons/gi";
import { CopyLinkBtn } from "./CopyLinkBtn";
import { Search } from "./Search";
import styles from "../styles/nav.module.css";
import Link from "next/link";

export const Nav: FC<{ handleSearch: (input: string) => Promise<void> }> = ({
  handleSearch
}) => {
  return (
    <ul className={styles.navItems}>
      <li className={styles.home}>
        <Link href="/">
          <GiProtectionGlasses className={styles.icon} />
        </Link>
      </li>
      <li className={styles.search}>
        <Search handleSearch={handleSearch} />
      </li>
      <li className={styles.copy}>
        <CopyLinkBtn />
      </li>
    </ul>
  );
};
