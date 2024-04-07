import Link from "next/link";
import type { SidebarNavItem } from "@/types";
import { Package2 } from "lucide-react";

import { Icons } from "@/components/icons";

interface SideNavProps {
  items: SidebarNavItem[];
}

export function SideNav({ items }: SideNavProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid gap-2 text-lg font-medium">
      <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
        <Package2 className="size-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Icon className="size-5" />
              {item.title}
            </Link>
          )
        );
      })}
    </nav>
  );
}
