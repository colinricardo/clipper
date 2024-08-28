import clsx from "clsx";
import { HTMLAttributes, PropsWithChildren } from "react";

interface PaddedContainerProps extends PropsWithChildren {
  className?: HTMLAttributes<HTMLDivElement> | string;
}

export default ({ children, className }: PaddedContainerProps) => {
  return (
    <div>
      <div
        className={clsx("mx-auto max-w-5xl px-4 sm:px-6 lg:px-8", className)}
      >
        {children}
      </div>
    </div>
  );
};
