import { SafeStyleProperties } from "./types/web3BtnInterface";

declare module "styles.module.css" {
  const classes: { [className: string]: string };
  export default classes;
}
