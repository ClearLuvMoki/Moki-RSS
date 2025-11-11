import { createHash } from "node:crypto";
import os from "node:os";

import { isDev } from "@/utils/tool";
import { PostHog } from "posthog-node";
import { ElectronStoreKeys } from "../domains/store-key";
import Store from "./store";

function getFingerprintId() {
  const data = [
    os.type(),
    os.arch(),
    os.platform(),
    os.cpus()?.[0]?.model ?? "",
    os.totalmem().toString(),
    os.hostname(),
  ].join("|");

  const hash = createHash("sha256").update(data).digest("hex");

  return hash;
}

const posthog = new PostHog("phc_VVNM9n3wQofYZnNUK4fAf7dO8aLECGzeh37Ky9tEOov", {
  host: "https://us.i.posthog.com",
});

export function initStatistics() {
  if (isDev) return;
  let EquipmentId = "";
  if (Store.hasKey(ElectronStoreKeys.EquipmentId)) {
    EquipmentId = Store.getValue(ElectronStoreKeys.EquipmentId);
  } else {
    EquipmentId = getFingerprintId();
    console.log(EquipmentId, "EquipmentId");
    Store.setValue(ElectronStoreKeys.EquipmentId, EquipmentId);
  }
  posthog.capture({
    distinctId: EquipmentId,
    event: "moki_rss_open",
    properties: {
      id: EquipmentId,
      platform: os.platform ?? process.platform,
      type: os.type(),
      arch: os.arch(),
      cpus: os.cpus()?.[0]?.model ?? "",
      totalmem: os.totalmem().toString(),
      hostname: os.hostname(),
      timestamp: Date.now(),
    },
  });
}
