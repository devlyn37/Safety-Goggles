import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { getCollections, CollectionInfo } from "../utils/data";

export const CollectionSearch: FC<{
  value: CollectionInfo;
  onChange: (option: CollectionInfo) => void;
  address: string;
  style?: any;
}> = ({ value, onChange, address, style }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [collections, setCollections] = useState<CollectionInfo[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const data = await getCollections(address);
        setCollections(data);
      } catch (e) {
        //handle this
        console.log(e);
      }

      setLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "2px solid black",
      borderRadius: "10px",
    }),
  };

  return (
    <Select<CollectionInfo>
      value={value}
      onChange={onChange}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.slug}
      styles={customStyles}
      options={collections}
      isLoading={loading}
      isClearable={true} // Clearing sets value to null fyi
      theme={(theme) => ({
        ...theme,
        borderRadius: 5,
        colors: {
          ...theme.colors,
          primary25: "lightgray",
          primary: "black",
          neutral10: "black",
          neutral20: "black",
          neutral30: "black",
          neutral40: "black",
          neutral50: "black",
          neutral60: "black",
          neutral70: "black",
          neutral80: "black",
        },
      })}
    />
  );
};
