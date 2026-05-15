import React from "react";
import type { Milestone } from "../../types/milestone";
import { MilestoneCard } from "./MilestoneCard";

interface MilestoneListProps {
  milestones: Milestone[];
  isClient: boolean;
  onApprove?: (id: string) => void;
  onDispute?: (id: string) => void;
  onSubmit?: (id: string) => void;
}

export function MilestoneList({ milestones, isClient, onApprove, onDispute, onSubmit }: MilestoneListProps) {
  if (milestones.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-gray-500">No milestones found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <MilestoneCard 
          key={milestone.id} 
          milestone={milestone} 
          isClient={isClient}
          onApprove={onApprove}
          onDispute={onDispute}
          onSubmit={onSubmit}
        />
      ))}
    </div>
  );
}
