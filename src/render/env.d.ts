import type { IpcRendererEvent } from "electron";

declare global {
  interface Window {
    IPC: {
      invoke: (channel: string, ...arg: any[]) => Promise<any>;
      on: (
        channel: string,
        callback: (event: IpcRendererEvent, data: any) => void,
      ) => Electron.IpcRenderer;
      removeAllListeners: (channel: string) => void;
    };
  }
}
