import { useGlobalStore } from "../../store";

const RSSList = () => {
  const { rssList, activeFeed } = useGlobalStore();
  return (
    <div className="w-full h-full overflow-y-scroll p-6">
      {rssList.map((item) => {
        return <div key={item?.id}>12</div>;
      })}
    </div>
  );
};

export default RSSList;
