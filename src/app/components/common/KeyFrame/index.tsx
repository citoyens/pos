import * as React from "react";

interface IProps {
  name: string;
  [key: string]: React.CSSProperties | string;
}

const KeyFrames = (props: IProps): JSX.Element => {
  const { name, ...otherProps } = props;
  const toCss = (cssObject: React.CSSProperties | string) =>
    typeof cssObject === "string"
      ? cssObject
      : Object.keys(cssObject).reduce((accumulator, key) => {
          const cssKey = key.replace(/[A-Z]/g, (v) => `-${v.toLowerCase()}`);
          const cssValue = (cssObject as any)[key].toString().replace("'", "");
          return `${accumulator}${cssKey}:${cssValue};`;
        }, "");

  return (
    <style>
      {`@keyframes ${name} {
        ${Object.keys(otherProps)
          .map((key) => {
            let result = "";
            if (["from", "to"].includes(key)) {
              result = `${key} { ${toCss(otherProps[key])} }`;
            }
            if (/^_[0-9]+$/.test(key)) {
              result = `${key.replace("_", "")}% { ${toCss(otherProps[key])} }`;
            }
            return result;
          })
          .join(" ")}
      }`}
    </style>
  );
};

export default KeyFrames;
