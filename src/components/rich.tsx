import { Fragment, type ReactNode } from "react";

/** Render "{key}" placeholders in a translated string as React nodes. */
export function rich(template: string, nodes: Record<string, ReactNode>): ReactNode {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return <Fragment key={i}>{key !== undefined && key in nodes ? nodes[key] : part}</Fragment>;
  });
}
