import { useEffect } from "react";
import Empty from "../components/empty";
import { useGlobalStore } from "../store";
import Header from "./header";
import Sider from "./sider";

const Layout = () => {
  const { reloadFeed } = useGlobalStore();

  useEffect(() => {
    reloadFeed();
  }, [reloadFeed]);

  return (
    <div className="w-full h-full">
      <Header />
      <div className="h-[calc(100%-50px)] w-full flex flex-nowrap">
        <Sider />
        <div className="w-[calc(100%-240px)] h-full">
          <div className="h-full w-full flex justify-center items-center">
            <Empty />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
