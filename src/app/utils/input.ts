import { KeyboardEvent } from "react";

export const onInputKeyDown = (e: KeyboardEvent, step: number = 1) => {
  if (e.key === "Enter") {
    const fields = Array.from(e.currentTarget.querySelectorAll("input")) || [];
    const position = fields.indexOf(e.target as HTMLInputElement);

    const nextInput = fields[position + step];

    if (nextInput !== undefined && nextInput.name === "value") {
      nextInput.focus();
    } else {
      fields[position].blur();
    }
  }
};

export const castStringToNumber = (value: string) => {
  const valueInNumber = Number(value);
  return isNaN(valueInNumber) ? 0 : valueInNumber;
};
