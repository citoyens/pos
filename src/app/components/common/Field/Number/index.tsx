import CustomField, { Props as TextFieldCustomProps } from "..";

type Props = TextFieldCustomProps & {
  value?: number;
  onChangeValue?: (value: number) => void;
};

const NumberField = (props: Props) => {
  return (
    <CustomField
      {...props}
      type="number"
      onChangeInputValue={(e) => props.onChangeValue?.(Number(e))}
    />
  );
};

export default NumberField;
