import { Properties } from "csstype";

export interface IWeb3ButtonOptions {
  onSuccess?: (arg0: string) => void;
  onFailure?: () => void;
  web3AuthAPI: string;
  roleAPI: string;
  rolesEnum: string[];

  chainId: number;
  account?: string | null;
  accessLevel: 0 | 1 | 2 | 3 | 4;
  // contractAddr: string;
  // abi: any;
  styles?: SafeStyleProperties;
  disableDefaultStyles?: boolean;
  customClass?: string;

  // button: HTMLButtonElement;
}

export default interface IWeb3Button {
  // onSuccess: () => void;
  // onFailure: () => void;
  // styles: SafeStyleProperties;
  // button: HTMLButtonElement;
  render: (parentElement: HTMLElement) => void;
  getButtonElement: () => HTMLButtonElement;
}

type CSSKeys = keyof CSSStyleDeclaration;
type PropertyKeys = keyof Properties<string | number>;
type CommonStyleKeys = CSSKeys & PropertyKeys;

export type SafeStyleProperties = Pick<
  Properties<string | number>,
  CommonStyleKeys
>;
