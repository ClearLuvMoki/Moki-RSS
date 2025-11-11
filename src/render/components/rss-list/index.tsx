import { useMemo } from "react";
import { useGlobalStore } from "../../store";
import Card from "./card";
import Magazine from "./magazine";

const RSSCard = () => {
  const { config } = useGlobalStore();
  console.log(config?.listMode, "llll");

  return useMemo(() => {
    switch (config?.listMode) {
      case "card": {
        return <Card />;
      }
      case "magazine": {
        return <Magazine />;
      }
      default:
        return <Card />;
    }
  }, [config?.listMode]);
};

export default RSSCard;
