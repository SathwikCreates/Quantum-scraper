"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/jobs", label: "Jobs" },
  { href: "/stats", label: "Statistics" },
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-secondary/80 py-4 shadow-md backdrop-blur">
      <div className="container flex flex-col items-center justify-center px-4 md:px-6 relative">
        <Link href="/" className="mb-2">
          <h1 className="text-3xl font-bold text-accent">
            Quantum Dashboard
          </h1>
        </Link>
        <nav className="flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent hover:underline underline-offset-4",
                pathname === link.href
                  ? "text-accent"
                  : "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute top-1/2 -translate-y-1/2 right-6 hidden md:block">
            <p className="text-xs text-accent/80 font-medium">“We show real-time jobs, while others only show you the job.”</p>
        </div>
      </div>
    </header>
  );
}
