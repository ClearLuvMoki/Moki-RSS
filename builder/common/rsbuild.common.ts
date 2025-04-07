import { defineConfig } from "@rsbuild/core";
import { join } from "node:path";
import { rootPath, srcPath } from "./paths";

const CommonConfig = defineConfig({
  performance: {
    buildCache: false,
  },
  source: {
    decorators: {
      version: "legacy",
    },
  },
  resolve: {
    alias: {
      "@/src": join(rootPath, "./src/"),
      "@/types": join(rootPath, "./types/"),
      "@/render": join(srcPath, "./render/"),
      "@/main": join(srcPath, "./main/"),
      "@/database": join(srcPath, "./database/"),
      "@/domains": join(srcPath, "./domains/"),
      "@/utils": join(srcPath, "./utils/"),
      "@/components": join(srcPath, "./render/components/"),
    },
  },
});

export default CommonConfig;
