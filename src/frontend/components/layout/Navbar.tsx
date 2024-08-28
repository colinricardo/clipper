import { Menu } from "lucide-react";
import Link from "next/link";

import { APP_NAME } from "@/backend/config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DarkModeToggle from "@/frontend/components/common/DarkModeToggle";
import NavbarButtons from "@/frontend/components/layout/NavbarButtons";

export default ({ children }: { children: React.ReactNode }) => {
  const renderDesktop = () => (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-3">
          <Link href="/" className="flex items-center font-semibold">
            <span className="">{APP_NAME}</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium">
            {/* Add navigation items here if needed */}
          </nav>
        </div>
        <NavbarButtons />
      </div>
    </div>
  );

  const renderMobile = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span className="">{APP_NAME}</span>
          </Link>
          {/* Add mobile navigation items here if needed */}
        </nav>
        <NavbarButtons />
      </SheetContent>
    </Sheet>
  );

  const renderHeader = () => (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4">
      {renderMobile()}
      <div className="flex-1" />
      <DarkModeToggle />
    </header>
  );

  const renderMain = () => (
    <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[200px_1fr]">
      {renderDesktop()}
      <div className="flex flex-col h-screen">
        {renderHeader()}
        {renderMain()}
      </div>
    </div>
  );
};
