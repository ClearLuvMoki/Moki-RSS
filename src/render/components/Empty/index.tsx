import EmptyText from "@render/components/EmptyText";
import Icon from "../../../../icons/icon.svg"
import React from "react";

interface Props {
    icon?: React.ReactNode;
    desc?: string;
}

const Empty = ({icon, desc}: Props) => {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            {icon || <img src={Icon} className="w-20 h-20"/>}
            <EmptyText content={desc}
            />
        </div>
    );
};

export default Empty;
