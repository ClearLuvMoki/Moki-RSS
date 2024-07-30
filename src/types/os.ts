export const DefaultValue = {
    theme: "light",
    lang: "en-US",
    listMode: "magazine"
}

export interface OSType {
    // TODO: 固定给一个ID，方便后续扩展多用户
    id: "1";
    locale: string;
    theme: "dark" | "light" | "os";
    listMode: "magazine" | "compact"
}
