// @ts-ignore
import Icon from "@/icons/icon.svg";
import EmptyText from "../empty-text";

interface Props {
  icon?: React.ReactNode;
  desc?: string;
}

const Empty = ({ icon, desc }: Props) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      {icon || <img src={Icon} className="w-20 h-20" alt="empty-icon" />}
      <EmptyText content={desc} />
    </div>
  );
};

export default Empty;
