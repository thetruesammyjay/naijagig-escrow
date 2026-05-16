"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useJobs } from "../../../hooks/useJob";
import type { Job, JobStatus } from "../../../types/job";
import type { MilestoneStatus } from "../../../types/milestone";

function calcStats(jobs: Job[]) {
  const activeJobs = jobs.filter((j) =>
    (["DRAFT", "FUNDED", "IN_PROGRESS", "DISPUTED"] as JobStatus[]).includes(j.status)
  );

  const totalInEscrow = jobs
    .flatMap((j) => j.milestones)
    .filter((m) => m.status === "FUNDED" || m.status === "IN_PROGRESS" || m.status === "SUBMITTED")
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const pendingReview = jobs
    .flatMap((j) => j.milestones)
    .filter((m) => m.status === "SUBMITTED")
    .length;

  return { activeJobs, totalInEscrow, pendingReview };
}

function formatNaira(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

export default function ClientDashboard() {
  const { data: session } = useSession();
  const { jobs, isLoading } = useJobs();

  const userName = session?.user?.name ?? "there";
  const { activeJobs, totalInEscrow, pendingReview } = calcStats(jobs);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between border-l-4 border-l-primary bg-gradient-to-r from-white to-green-50/30">
        <div>
          <h2 className="text-2xl font-bricolage font-bold text-gray-900 mb-1">Welcome back, {userName}!</h2>
          <p className="text-gray-600">Here's an overview of your active projects and escrow funds.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link href="/client/jobs/new" className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-green-800 transition-all flex items-center justify-center gap-2">
            <i className="bi bi-plus-lg"></i> Post New Job
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm">Active Jobs</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <i className="bi bi-briefcase"></i>
            </div>
          </div>
          <div className="text-3xl font-bricolage font-bold text-gray-900">
            {isLoading ? "—" : activeJobs.length}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm">Total in Escrow</h3>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-primary">
              <i className="bi bi-shield-lock"></i>
            </div>
          </div>
          <div className="text-3xl font-bricolage font-bold text-gray-900">
            {isLoading ? "—" : formatNaira(totalInEscrow)}
          </div>
          <p className="text-sm text-gray-500 mt-2">Locked in Stellar smart contracts</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm">Milestones Pending Review</h3>
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <i className="bi bi-clock-history"></i>
            </div>
          </div>
          <div className="text-3xl font-bricolage font-bold text-gray-900">
            {isLoading ? "—" : pendingReview}
          </div>
          <p className="text-sm text-yellow-600 mt-2">Requires your approval</p>
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <h3 className="font-bricolage font-bold text-lg text-gray-900 mb-4">Recent Jobs</h3>
        <div className="glass-card rounded-2xl overflow-hidden">
          {isLoading ? (
             <div className="p-8 text-center text-gray-400 animate-pulse">
                Loading jobs...
             </div>
          ) : jobs.length === 0 ? (
             <div className="p-10 text-center text-gray-400">
                <i className="bi bi-clipboard-x text-4xl mb-3 block"></i>
                <p className="font-semibold">No jobs posted yet</p>
                <p className="text-sm mt-1">Post a new job to get started.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Job Title</th>
                    <th className="p-4 font-semibold">Freelancer</th>
                    <th className="p-4 font-semibold">Budget</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {jobs.map((job) => {
                    const statusColor: Record<string, string> = {
                      DRAFT: "text-blue-700 bg-blue-50",
                      FUNDED: "text-green-700 bg-green-50",
                      IN_PROGRESS: "text-yellow-700 bg-yellow-50",
                      COMPLETED: "text-gray-700 bg-gray-100",
                      DISPUTED: "text-red-700 bg-red-50"
                    };
                    return (
                      <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">{job.title}</td>
                        <td className="p-4 text-gray-600">{job.freelancerId ? "Assigned" : "Not Assigned"}</td>
                        <td className="p-4 text-gray-600 font-medium">{formatNaira(Number(job.totalAmount))}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[job.status] || "text-gray-700 bg-gray-100"}`}>
                            {job.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link href={`/client/jobs/${job.id}`} className="text-primary hover:underline font-semibold">
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}