import { resolve } from "node:path";
import { app } from "electron";
import logger from "./logger";

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("moki-rss", process.execPath, [resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient("moki-rss");
}

// app.on("open-url", (event, url) => {
//   event.preventDefault();
//   const parsed = new URL(url);
//   if (parsed.protocol === "moki-rss:") {
//     const path = parsed.hostname;
//     const code = parsed.searchParams.get("code");
//     logger.info(`Auth Info: "Path:", ${path}, "Code:", ${code}`);
//     if (path === "github-auth") {

//     }
//   }
// });
