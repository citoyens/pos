import CustomField, { Props as TextFieldCustomProps } from "..";

type Props = TextFieldCustomProps & {
  value?: string;
  onChangeValue?: (value: string) => void;
};

const TextField = (props: Props) => {
  return (
    <CustomField
      {...props}
      type="text"
      onChangeInputValue={(e) => props.onChangeValue?.(String(e))}
    />
  );
};

export default TextField;
