import Header from "./header";
import Sider from "./sider";

const Layout = () => {
  return (
    <div className="w-full h-full flex flex-nowrap">
      <Sider />
      <div className="w-[calc(100%-240px)] h-full">
        <Header />
        <div className="h-[calc(100%-50px)] w-full">2323</div>
      </div>
    </div>
  );
};

export default Layout;
