import { defineConfig, mergeRsbuildConfig } from "@rsbuild/core";
import { releaseMainPath, rootPath, srcMainPath } from "../common/paths";
import { join } from "node:path";
import CommonConfig from "../common/rsbuild.common";

const Config = defineConfig({
  tools: {
    rspack: {
      target: "electron-main",
    },
  },
  source: {
    entry: {
      index: join(srcMainPath, "./index.ts"),
      preload: join(srcMainPath, "./preload.ts"),
    },
  },
  output: {
    target: "node",
    distPath: {
      root: join(releaseMainPath),
    },
    cleanDistPath: true,
    copy: [
      {
        from: join(
          rootPath,
          "./node_modules/better-sqlite3/build/Release/better_sqlite3.node",
        ),
        to: join(rootPath, "./release/dist/main"),
        force: true,
      },
      {
        from: join(rootPath, "./icons/icon.png"),
        to: join(rootPath, "./release/dist/main"),
        force: true,
      },
    ],
  },
});

module.exports = mergeRsbuildConfig(CommonConfig, Config);
