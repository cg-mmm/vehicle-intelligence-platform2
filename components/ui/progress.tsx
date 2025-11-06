"use client";

import * as React from "react";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & { value?: number };

export default function Progress({ value = 0, className = "", ...rest }: ProgressProps) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      className={`h-2 w-full rounded bg-black/10 ${className}`}
      {...rest}
    >
      <div className="h-full rounded bg-black/60" style={{ width: `${v}%` }} />
    </div>
  );
}
