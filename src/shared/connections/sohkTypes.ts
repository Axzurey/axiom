export interface sohkConnection {
    callback: (...args: never[]) => unknown;
    disconnect: () => void;
    wait: () => unknown;
    called: boolean;
    passedArgs: never[]
}