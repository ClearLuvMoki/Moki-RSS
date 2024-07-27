import {useTranslation} from "react-i18next";

interface Props {
    content?: string;
}

const EmptyText = ({content}: Props) => {
    const {t} = useTranslation();
    return (
        <span className="text-sm text-gray-400 select-none">
            {content || t("empty.index")}
        </span>
    );
};

export default EmptyText;
