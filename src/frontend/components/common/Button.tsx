import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ButtonWithLoadingProps extends ButtonProps {
  isLoading?: boolean;
}

export default ({ isLoading, children, ...rest }: ButtonWithLoadingProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {children}
        </>
      );
    }
    return children;
  };

  const render = () => (
    <Button {...rest} disabled={isLoading || rest.disabled}>
      {renderContent()}
    </Button>
  );

  return render();
};
