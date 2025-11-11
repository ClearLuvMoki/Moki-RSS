import { defineConfig, mergeRsbuildConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { join } from "node:path";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { spawn } from "node:child_process";
import { srcRenderPath } from "../common/paths";
import CommonConfig from "../common/rsbuild.common";

export const ReactCompilerConfig = {
  target: "18",
};

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
  server: {
    port: Number(process.env.PORT!),
  },
  dev: {
    setupMiddlewares: [
      (middlewares) => {
        spawn("npm", ["run", "dev:main"], {
          shell: true,
          stdio: "inherit",
        }).on("error", (spawnError: Error) => {
          console.error(`Main Server err:${spawnError}`);
        });
        return middlewares;
      },
    ],
  },
});

module.exports = mergeRsbuildConfig(CommonConfig, Config);
