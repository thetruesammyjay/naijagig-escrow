"use client";
import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../ui/modal";
import { Button } from "../ui/button";
import { useMilestone } from "../../hooks/useMilestone";
import { useToast } from "../ui/toast";

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  milestoneId: string;
  milestoneSequence: number;
  onSuccess?: () => void;
}

export function DisputeModal({
  isOpen,
  onClose,
  jobId,
  milestoneId,
  milestoneSequence,
  onSuccess,
}: DisputeModalProps) {
  const [reason, setReason] = useState("");
  const { disputeMilestone, isDisputing } = useMilestone(jobId);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.warning("Please provide a reason for the dispute.");
      return;
    }

    const result = await disputeMilestone(milestoneSequence, reason);

    if (result.success) {
      toast.success(
        "Dispute raised successfully. Our team will review the details and contact both parties."
      );
      setReason("");
      onClose();
      onSuccess?.();
    } else {
      toast.error(result.error ?? "Failed to raise dispute. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Raise Dispute</ModalHeader>
      <ModalBody>
        <p className="text-sm text-gray-600 mb-4">
          Please provide a detailed reason for disputing this milestone. Our
          arbitration team will review the case and reach out to both parties.
        </p>
        <textarea
          className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 resize-none text-sm"
          placeholder="Describe the issue clearly — what was promised vs what was delivered..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isDisputing}
        />
        <p className="text-xs text-gray-400 mt-2">
          {reason.length}/500 characters
        </p>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isDisputing}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleSubmit}
          isLoading={isDisputing}
          disabled={!reason.trim()}
        >
          Submit Dispute
        </Button>
      </ModalFooter>
    </Modal>
  );
}
