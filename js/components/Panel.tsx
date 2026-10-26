import type { ReactNode } from "react";

export type PanelProps = {
  title?: string;
  children: ReactNode;
};

export function Panel({ title, children }: PanelProps) {
  return (
    <section className="dashboard-panel">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}
