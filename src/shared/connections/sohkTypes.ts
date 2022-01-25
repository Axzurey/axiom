export interface sohkConnection {
    callback: (...args: never[]) => unknown;
    disconnect: () => void;
}