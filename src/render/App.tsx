import Layout from "@/render/layout";
import { useEffect } from "react";
import { useGlobalStore } from "./store";

const App = () => {
  const { reloadFeed, reloadGroup, reloadConfig } = useGlobalStore();

  useEffect(() => {
    reloadFeed();
    reloadGroup();
    reloadConfig();
  }, [reloadFeed, reloadGroup, reloadConfig]);

  return <Layout />;
};

export default App;
