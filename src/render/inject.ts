import type { IpcRendererEvent } from "electron";

class Inject {
  public static invoke<T, R>(channel: string, data?: T): Promise<R> {
    return window.IPC.invoke(channel, data) as Promise<R>;
  }

  public static on<T>(channel: string, callback: (event: IpcRendererEvent, data: T) => void) {
    return window.IPC.on(channel, callback);
  }

  public static removeAllListeners(channel: string) {
    return window.IPC.removeAllListeners(channel);
  }
}

export default Inject;
