import Link from "next/link";

import { APP_NAME } from "@/backend/config";
import DarkModeToggle from "@/frontend/components/common/DarkModeToggle";

export default ({ children }: { children: React.ReactNode }) => {
  const renderHeader = () => (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4">
      <Link href="/" className="flex items-center font-semibold">
        <span className="">{APP_NAME}</span>
      </Link>
      <div className="flex-1" />

      <DarkModeToggle />
    </header>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {renderHeader()}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};
