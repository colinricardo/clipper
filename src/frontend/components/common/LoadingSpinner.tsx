import { Loader2 } from "lucide-react";

export default () => {
  const renderMain = () => {
    return (
      <div>
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  };

  const render = () => {
    return renderMain();
  };

  return render();
};
