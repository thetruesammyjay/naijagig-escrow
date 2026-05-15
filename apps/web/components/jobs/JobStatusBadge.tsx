import React from "react";

export type JobStatus = "open" | "in-progress" | "pending-review" | "completed" | "disputed";

interface JobStatusBadgeProps {
  status: JobStatus;
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const statusConfig: Record<JobStatus, { label: string; className: string }> = {
    "open": {
      label: "Open",
      className: "bg-blue-50 text-blue-700",
    },
    "in-progress": {
      label: "In Progress",
      className: "bg-orange-50 text-orange-700",
    },
    "pending-review": {
      label: "Pending Review",
      className: "bg-yellow-50 text-yellow-700",
    },
    "completed": {
      label: "Completed",
      className: "bg-green-50 text-green-700",
    },
    "disputed": {
      label: "Disputed",
      className: "bg-red-50 text-red-700",
    }
  };

  const config = statusConfig[status];

  if (!config) return null;

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}
