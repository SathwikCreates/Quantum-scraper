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
    <header className="sticky top-0 z-50 w-full bg-slate-900 py-4">
      <div className="container flex flex-col items-center justify-center px-4 md:px-6">
        <Link href="/" className="mb-2">
          <h1 className="text-3xl font-bold text-orange-500">
            Quantum Dashboard
          </h1>
        </Link>
        <nav className="flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500 hover:underline underline-offset-4",
                pathname === link.href
                  ? "text-white"
                  : "text-gray-400"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
