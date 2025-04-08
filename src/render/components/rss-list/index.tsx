import { useMemo } from "react";
import { useGlobalStore } from "../../store";
import Card from "./card";

const RSSCard = () => {
  const { config } = useGlobalStore();

  return useMemo(() => {
    switch (config?.listMode) {
      case "card": {
        return <Card />;
      }
      default:
        return <Card />;
    }
  }, [config?.listMode]);
};

export default RSSCard;
