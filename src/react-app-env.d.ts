/// <reference types="react-scripts" />
declare namespace JSX {
  interface IntrinsicElements {
    "widget-tt": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      env: string;
      kitchen: string;
      user: string;
    };
  }
}
