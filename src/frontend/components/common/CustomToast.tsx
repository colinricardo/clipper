import { cn } from "@/frontend/lib/utils";

const MIN_HEIGHT = "min-h-16";
const WIDTH = "w-[22rem]";

export default ({
  t,
  message,
  variant = "info",
}: {
  t: string | number;
  message: string;
  variant?: string;
}) => {
  const renderMain = () => {
    if (variant === "green") {
      return (
        <div
          key={t}
          className={cn(MIN_HEIGHT, WIDTH, "bg-green-500 border rounded-md")}
        >
          <div
            className={cn(
              MIN_HEIGHT,
              "flex flex-col justify-center w-full px-4 py-2 text-left "
            )}
          >
            <p className="leading-7 text-md text-destructive-foreground">
              {message}
            </p>
          </div>
        </div>
      );
    }

    if (variant === "error") {
      return (
        <div
          key={t}
          className={cn(MIN_HEIGHT, WIDTH, "bg-destructive border rounded-md")}
        >
          <div
            className={cn(
              MIN_HEIGHT,
              "flex flex-col justify-center w-full px-4 py-2 text-left "
            )}
          >
            <p className="leading-7 text-md text-destructive-foreground">
              {message}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        key={t}
        className={cn(MIN_HEIGHT, WIDTH, "bg-background border rounded-md")}
      >
        <div
          className={cn(
            "flex flex-col justify-center w-full h-16 px-4 py-2 text-left "
          )}
        >
          <p className="leading-7 text-md">{message}</p>
        </div>
      </div>
    );
  };

  const render = () => {
    return renderMain();
  };

  return render();
};
