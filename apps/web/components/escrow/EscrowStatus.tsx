import React from "react";
import { Badge } from "../ui/badge";
import type { MilestoneStatus } from "../../types/milestone";

/**
 * EscrowStatus — renders the correct badge for a milestone's canonical status.
 * Status values match context.md: PENDING, SUBMITTED, APPROVED, DISPUTED, RESOLVED.
 */
export function EscrowStatus({ status }: { status: MilestoneStatus }) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="secondary">
          <i className="bi bi-clock mr-1" /> Pending
        </Badge>
      );
    case "SUBMITTED":
      return (
        <Badge variant="warning">
          <i className="bi bi-hourglass-split mr-1" /> Under Review
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge variant="success">
          <i className="bi bi-check-circle-fill mr-1" /> Approved
        </Badge>
      );
    case "DISPUTED":
      return (
        <Badge variant="danger">
          <i className="bi bi-exclamation-triangle-fill mr-1" /> Disputed
        </Badge>
      );
    case "RESOLVED":
      return (
        <Badge variant="info">
          <i className="bi bi-shield-check mr-1" /> Resolved
        </Badge>
      );
    case "FUNDED":
      return (
        <Badge variant="secondary">
          <i className="bi bi-shield-lock-fill mr-1 text-green-600" /> Funded
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge variant="secondary">
          <i className="bi bi-gear-fill mr-1 text-blue-600" /> In Progress
        </Badge>
      );
    case "RELEASED":
      return (
        <Badge variant="success">
          <i className="bi bi-cash-stack mr-1" /> Released
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}
