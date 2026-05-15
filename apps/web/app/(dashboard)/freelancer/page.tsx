"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useJobs } from "../../../hooks/useJob";
import type { Job, JobStatus } from "../../../types/job";
import type { MilestoneStatus } from "../../../types/milestone";

function calcStats(jobs: Job[]) {
  const activeJobs = jobs.filter((j) =>
    (["FUNDED", "IN_PROGRESS", "DISPUTED"] as JobStatus[]).includes(j.status)
  );

  const totalEarned = jobs
    .filter((j) => j.status === "COMPLETED")
    .flatMap((j) => j.milestones)
    .filter((m) => m.status === "RELEASED")
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const escrowIncoming = jobs
    .flatMap((j) => j.milestones)
    .filter((m) => m.status === "FUNDED")
    .reduce((sum, m) => sum + Number(m.amount), 0);

  return { activeJobs, totalEarned, escrowIncoming };
}

function formatNaira(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount.toLocaleString()}`;
}

export default function FreelancerDashboard() {
  const { data: session } = useSession();
  const { jobs, isLoading } = useJobs();

  const userName = session?.user?.name ?? "there";
  const { activeJobs, totalEarned, escrowIncoming } = calcStats(jobs);

  // Collect active milestones from all jobs
  const activeMilestones = jobs
    .filter((j) => (["FUNDED", "IN_PROGRESS"] as JobStatus[]).includes(j.status))
    .flatMap((j) =>
      j.milestones
        .filter((m) =>
          (["FUNDED", "IN_PROGRESS", "PENDING_REVIEW"] as MilestoneStatus[]).includes(m.status)
        )
        .map((m) => ({ ...m, jobTitle: j.title }))
    )
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between border-l-4 border-l-orange-500 bg-gradient-to-r from-white to-orange-50/30">
        <div>
          <h2 className="text-2xl font-bricolage font-bold text-gray-900 mb-1">
            Welcome back, {userName}!
          </h2>
          <p className="text-gray-600">
            {activeMilestones.length > 0
              ? `You have ${activeMilestones.length} active milestone${activeMilestones.length > 1 ? "s" : ""} in progress.`
              : "You have no active milestones right now. Find new work!"}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link
            href="/freelancer/jobs"
            className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
          >
            <i className="bi bi-search"></i> Find Work
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm">Active Contracts</h3>
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
            <h3 className="text-gray-500 font-semibold text-sm">Total Earned</h3>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-primary">
              <i className="bi bi-wallet2"></i>
            </div>
          </div>
          <div className="text-3xl font-bricolage font-bold text-gray-900">
            {isLoading ? "—" : formatNaira(totalEarned)}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm">Escrow Incoming</h3>
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <i className="bi bi-shield-check"></i>
            </div>
          </div>
          <div className="text-3xl font-bricolage font-bold text-gray-900">
            {isLoading ? "—" : formatNaira(escrowIncoming)}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm">Total Jobs</h3>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <i className="bi bi-star"></i>
            </div>
          </div>
          <div className="text-3xl font-bricolage font-bold text-gray-900">
            {isLoading ? "—" : jobs.length}
          </div>
        </div>
      </div>

      {/* Active Milestones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bricolage font-bold text-lg text-gray-900">Current Milestones</h3>
          <Link
            href="/freelancer/contracts"
            className="text-orange-600 text-sm font-semibold hover:underline"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : activeMilestones.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center text-gray-400">
            <i className="bi bi-clipboard-x text-4xl mb-3 block"></i>
            <p className="font-semibold">No active milestones</p>
            <p className="text-sm mt-1">Apply for jobs to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMilestones.map((m) => {
              const statusColor: Record<string, string> = {
                IN_PROGRESS: "text-blue-600 bg-blue-50",
                FUNDED: "text-green-600 bg-green-50",
                PENDING_REVIEW: "text-yellow-600 bg-yellow-50",
              };
              const statusLabel: Record<string, string> = {
                IN_PROGRESS: "In Progress",
                FUNDED: "Funded",
                PENDING_REVIEW: "Pending Review",
              };
              return (
                <div
                  key={m.id}
                  className="glass-card rounded-2xl p-6 border border-gray-100 hover:border-orange-200 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${statusColor[m.status] ?? "text-gray-600 bg-gray-50"}`}
                      >
                        {statusLabel[m.status] ?? m.status}
                      </span>
                      <h4 className="font-bricolage font-bold text-gray-900 text-lg mt-2">
                        {m.title}
                      </h4>
                      <p className="text-sm text-gray-500">{m.jobTitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bricolage font-bold text-xl text-gray-900">
                        {formatNaira(Number(m.amount))}
                      </span>
                      {m.status === "FUNDED" && (
                        <p className="text-xs text-green-600 mt-1">
                          <i className="bi bi-shield-lock-fill"></i> Funded in Escrow
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                    <p className="text-sm text-gray-500">
                      <i className="bi bi-calendar-event"></i>{" "}
                      No due date set
                    </p>
                    <button className="text-orange-600 font-bold text-sm hover:underline">
                      {m.status === "IN_PROGRESS" ? "Submit Work" : "View"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}