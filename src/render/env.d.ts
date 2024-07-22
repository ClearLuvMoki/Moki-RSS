/// <reference types="@rsbuild/core/types" />
import {IpcRenderer, IpcRendererEvent} from "electron"

declare global {
    interface Window {
        IPC: {
            invoke: (channel: string, data?: any) => Promise<any>;
            ipcOn: (channel: string, fun: (event: IpcRendererEvent, data: any) => void) => IpcRenderer;
            removeAllListeners: (channel: string) => IpcRenderer;
        }
    }
}


export {};
