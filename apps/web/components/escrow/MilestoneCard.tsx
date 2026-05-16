"use client";
import React from "react";
import type { Milestone } from "../../types/milestone";
import { formatDate } from "../../lib/utils";
import { EscrowStatus } from "./EscrowStatus";

interface MilestoneCardProps {
  milestone: Milestone;
  isClient: boolean;
  onApprove?: (id: string) => void;
  onDispute?: (id: string) => void;
  onSubmit?: (id: string) => void;
}

export function MilestoneCard({
  milestone,
  isClient,
  onApprove,
  onDispute,
  onSubmit,
}: MilestoneCardProps) {
  return (
    <div className="border border-gray-100 rounded-xl p-5 mb-4 bg-white hover:shadow-sm transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Milestone {milestone.sequence}
          </span>
          <h4 className="font-semibold text-gray-900 mt-1">{milestone.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
        </div>
        <div className="text-right ml-4">
          <div className="font-bold text-gray-900 font-mono text-sm">
            {milestone.amount} USDC
          </div>
          <div className="mt-2">
            <EscrowStatus status={milestone.status} />
          </div>
        </div>
      </div>

      {/* Submission note */}
      {milestone.submissionNote && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800 mb-3">
          <p className="font-semibold text-xs uppercase tracking-wider text-blue-600 mb-1">
            Freelancer Note
          </p>
          <p>{milestone.submissionNote}</p>
        </div>
      )}

      {/* Timestamps */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 border-t border-gray-50 pt-3 mt-3">
        {milestone.submittedAt && (
          <span>
            <i className="bi bi-upload mr-1" />
            Submitted: {formatDate(milestone.submittedAt)}
          </span>
        )}
        {milestone.approvedAt && (
          <span>
            <i className="bi bi-check-circle mr-1 text-green-500" />
            Approved: {formatDate(milestone.approvedAt)}
          </span>
        )}
        {milestone.disputedAt && (
          <span>
            <i className="bi bi-exclamation-triangle mr-1 text-red-500" />
            Disputed: {formatDate(milestone.disputedAt)}
          </span>
        )}
      </div>

      {/* Action buttons */}
      {isClient && milestone.status === "SUBMITTED" && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
          <button
            onClick={() => onDispute?.(milestone.id)}
            className="px-3 py-1.5 text-xs text-red-600 font-semibold bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center gap-1"
          >
            <i className="bi bi-flag" /> Dispute
          </button>
          <button
            onClick={() => onApprove?.(milestone.id)}
            className="px-3 py-1.5 text-xs text-white font-semibold bg-primary hover:bg-green-700 rounded-md transition-colors flex items-center gap-1"
          >
            <i className="bi bi-check-circle" /> Approve Release
          </button>
        </div>
      )}

      {!isClient && (milestone.status === "PENDING" || milestone.status === "FUNDED" || milestone.status === "IN_PROGRESS") && (
        <div className="flex justify-end mt-4 pt-3 border-t border-gray-50">
          <button
            onClick={() => onSubmit?.(milestone.id)}
            className="px-3 py-1.5 text-xs text-white font-semibold bg-primary hover:bg-green-700 rounded-md transition-colors flex items-center gap-1"
          >
            <i className="bi bi-upload" /> Submit for Review
          </button>
        </div>
      )}
    </div>
  );
}
