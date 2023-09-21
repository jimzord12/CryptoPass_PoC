import { Properties } from "csstype";

export interface IWeb3ButtonOptions {
  onSuccess?: () => void;
  onFailure?: () => void;
  web3AuthAPI: string;
  contractAddr: string;
  styles?: SafeStyleProperties;
  disableDefaultStyles?: boolean;
  customClass?: string;
  button: HTMLButtonElement;
}

export default interface IWeb3Button {
  // onSuccess: () => void;
  // onFailure: () => void;
  // styles: SafeStyleProperties;
  // button: HTMLButtonElement;
  render: (parentElement: HTMLElement) => void;
}

type CSSKeys = keyof CSSStyleDeclaration;
type PropertyKeys = keyof Properties<string | number>;
type CommonStyleKeys = CSSKeys & PropertyKeys;

export type SafeStyleProperties = Pick<
  Properties<string | number>,
  CommonStyleKeys
>;
