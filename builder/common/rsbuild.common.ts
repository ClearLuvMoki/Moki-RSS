import { defineConfig, loadEnv } from "@rsbuild/core";
import { join } from "node:path";
import { rootPath, srcPath } from "./paths";

const { parsed } = loadEnv();

const CommonConfig = defineConfig({
  performance: {
    buildCache: false,
  },
  source: {
    decorators: {
      version: "legacy",
    },
    define: Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value),
      ]),
    ),
  },
  resolve: {
    alias: {
      "@/src": join(rootPath, "./src/"),
      "@/icons": join(rootPath, "./icons/"),
      "@/types": join(rootPath, "./types/"),
      "@/render": join(srcPath, "./render/"),
      "@/main": join(srcPath, "./main/"),
      "@/database": join(srcPath, "./database/"),
      "@/domains": join(srcPath, "./domains/"),
      "@/utils": join(srcPath, "./utils/"),
      "@/constants": join(srcPath, "./constants/"),
      "@/components": join(srcPath, "./render/components/"),
    },
  },
});

export default CommonConfig;
