interface Props {
    content?: string;
}

const EmptyText = ({content}: Props) => {
    return (
        <span className="text-sm text-gray-400 select-none">
            {content || "暂无"}
        </span>
    );
};

export default EmptyText;
