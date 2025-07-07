"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { LangDropdown } from "./LangDropdown";

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col space-y-4 pt-10">
        <SheetHeader className="text-lg font-semibold text-primary">
          Menu
        </SheetHeader>
        <div className="flex items-center space-x-3">
          <LangDropdown />
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
