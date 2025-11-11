import { Spinner } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shiki";
import type { CodeToHastOptions } from "shiki";
import { useGlobalStore } from "../../store";

export async function highlightCode(code: string, options: CodeToHastOptions) {
  return await codeToHtml(code, options);
}

export function CodeBlock({ code, lange = "javascript" }: { code: string; lange?: string }) {
  const [loading, setLoading] = useState(true);
  const { config } = useGlobalStore();
  const [html, setHtml] = useState<string>("");

  if (!code) {
    return <></>;
  }

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

  useEffect(() => {
    highlightCode(code, {
      lang: lange,
      theme: $skin === "dark" ? "min-dark" : "min-light",
    })
      .then((html) => {
        setHtml(html);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error highlighting code:", error);
        setLoading(false);
      });
  }, [code, lange, $skin]);

  if (loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center border border-gray-200 rounded-lg my-2">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className="px-10 py-4 dark:bg-[#1f1f1f] border border-gray-200 rounded-lg my-2 text-wrap overflow-scroll"
    />
  );
}
