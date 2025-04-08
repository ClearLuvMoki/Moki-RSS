interface Props {
  content?: string;
}

const EmptyText = ({ content }: Props) => {
  return <span className="text-sm text-gray-400 select-none">{content || "No Data."}</span>;
};

export default EmptyText;
