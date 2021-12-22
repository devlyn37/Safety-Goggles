import { FC, useEffect, useState } from "react";
import { trimAddress, trunicate } from "../utils/misc";
import { AddressToENS } from "../utils/ens";
import { FiCopy, FiCheckSquare } from "react-icons/fi";
import styles from "../styles/address.module.css";

const formatAddress = (address: string): string => {
  return address ? trimAddress(address) : "Unknown";
};

export const AddressContainer: FC<{
  address: string;
  shouldResolveENS?: boolean;
  large?: boolean;
}> = ({ address, shouldResolveENS = false, large = false }) => {
  const [ens, setEns] = useState<null | string>(null);
  const [hasLoadedEns, setHasLoadedEns] = useState<boolean>(false);
  const [showCheck, setShowCheck] = useState<boolean>(false);

  useEffect(() => {
    const checkENS = async () => {
      setHasLoadedEns(true);
      const ens = await AddressToENS(address);

      if (ens) {
        setEns(ens);
      }
    };

    // We give the parent component control over if ens
    // should be resolved to avoid hammering server
    // and getting rate limited.
    if (shouldResolveENS && !hasLoadedEns) {
      checkENS();
    }
  }, [address, shouldResolveENS, ens, hasLoadedEns]);

  const handleClick = () => {
    if (showCheck) {
      return;
    }

    navigator.clipboard.writeText(address);
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

  const display = ens ? trunicate(ens, 50) : formatAddress(address);

  return (
    <div
      className={`${large ? styles.large : styles.small} ${styles.container}`}
      onClick={handleClick}
    >
      {display} {icon}
    </div>
  );
};
