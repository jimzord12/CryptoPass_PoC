import IWeb3Button, { IWeb3ButtonOptions } from "./types/web3BtnInterface";
export declare class Web3Button implements IWeb3Button {
    private onSuccess;
    private onFailure;
    private web3AuthAPI;
    private contractAddr;
    private styles?;
    private disableDefaultStyles?;
    private customClass?;
    private button;
    constructor(options: IWeb3ButtonOptions);
    _createButton(): HTMLButtonElement;
    _handleClick(): void;
    _notImplementedError(methodName: string): void;
    help(): void;
    render(parentElement: HTMLElement): void;
}
