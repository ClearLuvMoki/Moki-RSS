import { cn } from "@heroui/react";
import React from "react";

interface Props {
  show: boolean;
  className?: string;
}

export function UnReadPoint({ show, className = "" }: Props) {
  if (!show) return <React.Fragment />;
  return (
    <div
      className={cn(
        "w-2 min-w-2 min-h-2 h-2 rounded-full bg-primary-300 dark:bg-primary-600",
        className,
      )}
    />
  );
}
