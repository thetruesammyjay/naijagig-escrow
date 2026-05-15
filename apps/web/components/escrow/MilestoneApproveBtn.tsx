import React, { useState } from "react";
import { Button } from "../ui/button";

interface MilestoneApproveBtnProps {
  milestoneId: string;
  onApproveSuccess?: () => void;
}

export function MilestoneApproveBtn({ milestoneId, onApproveSuccess }: MilestoneApproveBtnProps) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    if (confirm("Are you sure you want to approve this milestone and release funds?")) {
      setIsApproving(true);
      try {
        // Simulate API call to release funds via TrustlessWork
        setTimeout(() => {
          setIsApproving(false);
          alert("Funds successfully released!");
          onApproveSuccess?.();
        }, 1500);
      } catch (e) {
        setIsApproving(false);
        alert("Failed to release funds.");
      }
    }
  };

  return (
    <Button 
      variant="primary" 
      size="sm" 
      onClick={handleApprove} 
      isLoading={isApproving}
    >
      Approve & Release
    </Button>
  );
}
