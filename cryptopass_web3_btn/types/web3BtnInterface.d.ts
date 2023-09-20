import { Properties } from "csstype";
export interface IWeb3ButtonOptions {
    onSuccess?: () => void;
    onFailure?: () => void;
    styles?: SafeStyleProperties;
}
export default interface IWeb3Button {
    render: (parentElement: HTMLElement) => void;
}
type CSSKeys = keyof CSSStyleDeclaration;
type PropertyKeys = keyof Properties<string | number>;
type CommonStyleKeys = CSSKeys & PropertyKeys;
export type SafeStyleProperties = Pick<Properties<string | number>, CommonStyleKeys>;
export {};
