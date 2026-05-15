"use client";
/**
 * Post New Job Page — client-only.
 */
import React from "react";
import { JobForm } from "../../../../../components/jobs/JobForm";

export default function NewJobPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-bricolage font-bold text-2xl text-gray-900">
          Post a New Job
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Define your project, set milestones, and deploy a Stellar escrow
          contract — all in one step.
        </p>
      </div>
      <JobForm />
    </div>
  );
}
