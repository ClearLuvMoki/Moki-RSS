import { defineConfig, mergeRsbuildConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { join } from "node:path";
import { releaseRenderPath, srcRenderPath } from "../common/paths";
import CommonConfig from "../common/rsbuild.common";
import { ReactCompilerConfig } from "./rsbuild.dev";
import { pluginBabel } from "@rsbuild/plugin-babel";

const Config = defineConfig({
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift([
          "babel-plugin-react-compiler",
          ReactCompilerConfig,
        ]);
      },
    }),
  ],
  source: {
    entry: {
      index: join(srcRenderPath, "./index.tsx"),
    },
  },
  output: {
    assetPrefix: "./",
    cleanDistPath: process.env.NODE_ENV === "production",
    distPath: {
      root: join(releaseRenderPath),
    },
  },
});

module.exports = mergeRsbuildConfig(CommonConfig, Config);
