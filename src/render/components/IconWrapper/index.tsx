import React, {memo} from 'react';
import deepEqual from "deep-equal";
import cn from "classnames";

interface Props {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    className?: string;
    style?: React.CSSProperties;
}

const BaseClassName = "flex cursor-pointer select-none items-center transition-all justify-center p-2 rounded-lg hover:bg-gray-100"

const IconWrapper = memo(({children, className, style, onClick}: Props) => {
    return (
        <div className={cn(className || "", BaseClassName)} style={style || {}} onClick={onClick} >
            {children}
        </div>
    );
}, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default IconWrapper;
