import Layout from "@/render/layout";
import { useEffect } from "react";
import { useGlobalStore } from "./store";

const App = () => {
  const { reloadFeed, reloadConfig } = useGlobalStore();

  useEffect(() => {
    reloadFeed();
    reloadConfig();
  }, [reloadFeed, reloadConfig]);

  return <Layout />;
};

export default App;
