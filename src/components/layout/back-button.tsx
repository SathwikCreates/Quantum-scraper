"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="link" onClick={() => router.back()} className="text-secondary hover:text-secondary/90 p-0 h-auto">
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
  );
}
