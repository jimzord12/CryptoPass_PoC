import { Properties } from "csstype";

export interface IWeb3ButtonOptions {
  onSuccess?: () => void;
  onFailure?: () => void;
  styles?: SafeStyleProperties;
}

export default interface IWeb3Button {
  // onSuccess: () => void;
  // onFailure: () => void;
  // styles: SafeStyleProperties;
  // button: HTMLButtonElement;
  render: (parentElement: HTMLElement) => void;
}

// export type CSSStyles = {
//   [K in keyof CSSStyleDeclaration]?: string;
// };

// type StringKeys<T> = Exclude<keyof T, number>;
// type NonSymbolKeys<T> = Exclude<keyof T, symbol>;
// type NonSymbolAndNumberKeys<T> = Exclude<keyof T, symbol | number>;

type CSSKeys = keyof CSSStyleDeclaration;
type PropertyKeys = keyof Properties<string | number>;
type CommonStyleKeys = CSSKeys & PropertyKeys;

export type SafeStyleProperties = Pick<
  Properties<string | number>,
  CommonStyleKeys
>;
