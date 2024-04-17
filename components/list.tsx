import type React from "react";

export function List({ children }: { children: React.ReactNode }) {
  return (
    <ul className="w-full divide-y divide-muted" role="list">
      {children}
    </ul>
  );
}
