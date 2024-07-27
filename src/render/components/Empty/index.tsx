import EmptyText from "@render/components/EmptyText";
import Icon from "../../../../icons/icon.svg"

interface Props {
    desc?: string;
}

const Empty = ({desc}: Props) => {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <img src={Icon} className="w-20 h-20"/>
            <EmptyText content={desc}
            />
        </div>
    );
};

export default Empty;