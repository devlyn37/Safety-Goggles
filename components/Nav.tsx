import { FC } from "react";
import { GiProtectionGlasses } from "react-icons/gi";
import { CopyLinkBtn } from "./CopyLinkBtn";
import { Search } from "./Search";
import styles from "../styles/nav.module.css";
import { useRouter } from "next/dist/client/router";

export const Nav: FC<{ handleSearch: (input: string) => Promise<void> }> = ({
  handleSearch,
}) => {
  const router = useRouter();
  const goHome = () => {
    router.push({
      pathname: "/",
    });
  };

  return (
    <div className={styles.navItems}>
      <div className={styles.home}>
        <GiProtectionGlasses
          style={{ fontSize: "50px", cursor: "pointer" }}
          onClick={goHome}
        />
      </div>
      <div className={styles.search}>
        <Search handleSearch={handleSearch} />
      </div>
      <div className={styles.copy}>
        <CopyLinkBtn />
      </div>
    </div>
  );
};
