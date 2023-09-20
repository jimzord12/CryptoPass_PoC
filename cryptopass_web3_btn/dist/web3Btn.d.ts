import IWeb3Button, { IWeb3ButtonOptions } from "./types/web3BtnInterface";
export declare class Web3Button implements IWeb3Button {
    private onSuccess;
    private onFailure;
    private styles;
    private button;
    constructor(options: IWeb3ButtonOptions);
    _createButton(): HTMLButtonElement;
    _handleClick(): void;
    _notImplementedError(methodName: string): void;
    render(parentElement: HTMLElement): void;
}
