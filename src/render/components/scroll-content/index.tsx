import "mac-scrollbar/dist/mac-scrollbar.css";
import { useGlobalStore } from "@/render/store";
import { MacScrollbar } from "mac-scrollbar";
import type { HTMLAttributes } from "react";
import { useMemo } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  suppressAutoHide?: boolean;
  suppressScrollX?: boolean;
  suppressScrollY?: boolean;
  classNames?: {
    root?: string;
    content?: string;
  };
}
const ScrollContent = (props: Props) => {
  const { config } = useGlobalStore();

  const $skin = useMemo(() => {
    const theme = config?.theme;
    switch (theme) {
      case "dark": {
        return "dark";
      }
      case "light": {
        return "light";
      }
      case "system": {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
      }
      default: {
        return "light";
      }
    }
  }, [config?.theme]);

  return (
    <MacScrollbar
      skin={$skin}
      className={props?.classNames?.root}
      suppressAutoHide={props?.suppressAutoHide}
      suppressScrollX={props?.suppressScrollX}
      suppressScrollY={props?.suppressScrollY}
      {...props}
    >
      <div className={props?.classNames?.content}>{props?.children}</div>
    </MacScrollbar>
  );
};

export default ScrollContent;
