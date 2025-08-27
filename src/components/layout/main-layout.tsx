import type { ReactNode } from "react";
import { Database } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";

type Props = {
  children: ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader className="items-center justify-center p-4 group-data-[collapsible=icon]:p-2">
          <Database className="size-6 text-accent" />
          <span className="text-lg font-semibold text-foreground duration-200 group-data-[collapsible=icon]:hidden">
            Quantum Scraper
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <SidebarTrigger className="md:hidden" />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
