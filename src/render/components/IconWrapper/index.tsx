import React, {forwardRef, memo} from 'react';
import deepEqual from "deep-equal";
import cn from "classnames";

interface Props {
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    className?: string;
    style?: React.CSSProperties;
}

const BaseClassName = "flex cursor-pointer select-none items-center transition-all justify-center p-2 rounded-lg dark:hover:bg-gray-700 light:hover:bg-gray-100"

const IconWrapper = memo(forwardRef((
    {
        children,
        className,
        style,
        onClick,
        isActive,
        ...props
    }: Props, ref: React.ForwardedRef<any>) => {
    return (
        <div ref={ref} {...props} className={cn(className || "", BaseClassName, isActive && "light:bg-gray-100 dark:bg-gray-700")}
             style={style || {}} onClick={onClick}>
            {children}
        </div>
    );
}), (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps, {strict: true})
});

export default IconWrapper;
