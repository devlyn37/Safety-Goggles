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
}> = ({ address, shouldResolveENS = true }) => {
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
      console.log("hello from " + address);
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
    <span className={styles.addressContainer} onClick={handleClick}>
      {display} {icon}
    </span>
  );
};
