"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { DisputeModal } from "./DisputeModal";

interface MilestoneDisputeBtnProps {
  jobId: string;
  milestoneId: string;
  milestoneSequence: number;
  onSuccess?: () => void;
}

export function MilestoneDisputeBtn({
  jobId,
  milestoneId,
  milestoneSequence,
  onSuccess,
}: MilestoneDisputeBtnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        icon="bi-flag"
        onClick={() => setIsModalOpen(true)}
      >
        Dispute
      </Button>

      <DisputeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={jobId}
        milestoneId={milestoneId}
        milestoneSequence={milestoneSequence}
        onSuccess={onSuccess}
      />
    </>
  );
}
