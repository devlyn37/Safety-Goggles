import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { getCollections, CollectionInfo } from "../utils/data";

export const CollectionSearch: FC<{
  value: CollectionInfo;
  onChange: (option: CollectionInfo) => void;
  address: string;
}> = ({ value, onChange, address }) => {
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
      borderRadius: "10px",
    }),
  };

  const CustomOption = (props) => {
    const { innerProps, isDisabled, data, isSelected, isFocused } = props;
    const { name, imgUrl } = data;

    const textColor = isSelected ? "white" : "black";
    const backgroundColor = isSelected
      ? "black"
      : isFocused
      ? "lightgray"
      : "white";

    return !isDisabled ? (
      <div
        {...innerProps}
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid lightgray",
          backgroundColor: backgroundColor,
          color: textColor,
        }}
      >
        <img
          style={{
            height: "40px",
            width: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "10px",
          }}
          src={imgUrl}
        />
        <div>{name}</div>
      </div>
    ) : null;
  };

  return (
    <Select<CollectionInfo>
      value={value}
      onChange={onChange}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.slug}
      components={{ Option: CustomOption }}
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
        },
      })}
    />
  );
};
