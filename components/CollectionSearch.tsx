import { FC } from "react";
import Select from "react-select";
import { CollectionInfo } from "../types";
import { addDefaultSrc } from "../utils/misc";

export const CollectionSearch: FC<{
  collections: CollectionInfo[];
  loading: boolean;
  value: CollectionInfo;
  disabled: boolean;
  onChange: (option: CollectionInfo) => void;
}> = ({ collections, loading, value, onChange, disabled }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "10px",
      border: "none"
    })
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
          color: textColor
        }}
      >
        <img
          style={{
            height: "40px",
            width: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "10px"
          }}
          src={imgUrl ?? "/no-image.jpeg"}
          alt={`Collection Image for ${name}`}
          onError={addDefaultSrc}
        />
        <div>{name}</div>
      </div>
    ) : null;
  };

  return (
    <Select<CollectionInfo>
      value={value}
      placeholder="Select a collection..."
      onChange={onChange}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.slug}
      components={{ Option: CustomOption }}
      styles={customStyles}
      options={collections}
      isLoading={loading}
      isDisabled={loading || disabled}
      isClearable={true} // Clearing sets value to null fyi
      theme={(theme) => ({
        ...theme,
        borderRadius: 10,
        colors: {
          ...theme.colors,
          primary25: "lightgray",
          primary: "#f2f2f2",
          neutral0: "#f2f2f2"
        }
      })}
    />
  );
};
