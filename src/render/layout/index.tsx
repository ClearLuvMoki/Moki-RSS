import ContentModal from "@/components/content-modal";
import Empty from "@/components/empty";
import RSSList from "@/components/rss-list";
import { useGlobalStore } from "../store";
import Header from "./header";
import Sider from "./sider";

const Layout = () => {
  const { rssList } = useGlobalStore();

  return (
    <div className="w-full h-full">
      <ContentModal />
      <Header />
      <div className="h-[calc(100%-50px)] w-full flex flex-nowrap">
        <Sider />
        <div className="w-[calc(100%-240px)] h-full">
          {rssList.length === 0 && (
            <div className="h-full w-full flex justify-center items-center">
              <Empty />
            </div>
          )}
          {rssList.length > 0 && <RSSList />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
