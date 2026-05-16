"use client";
import React from "react";
import Link from "next/link";
import { useJobs } from "../../../../hooks/useJob";

const statusColor: Record<string, string> = {
  DRAFT: "text-gray-700 bg-gray-100",
  FUNDED: "text-green-700 bg-green-50",
  IN_PROGRESS: "text-yellow-700 bg-yellow-50",
  MILESTONE_SUBMITTED: "text-orange-700 bg-orange-50",
  DISPUTED: "text-red-700 bg-red-50",
  COMPLETED: "text-blue-700 bg-blue-50",
  RELEASED: "text-purple-700 bg-purple-50",
};

function formatAmount(amount: string) {
  const n = Number(amount);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M USDC`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}k USDC`;
  return `${n.toLocaleString()} USDC`;
}

export default function MyContractsPage() {
  const { jobs, isLoading } = useJobs();
  
  // Show all jobs returned from useJobs where freelancer is assigned
  const myContracts = jobs.filter(j => j.freelancerId !== null);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-bricolage font-bold text-2xl text-gray-900">My Contracts</h2>
          <p className="text-gray-500 text-sm mt-1">Jobs you have been hired for — submit milestones and track payments.</p>
        </div>
        <Link
          href="/freelancer/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-green-800 transition-all"
        >
          <i className="bi bi-search" /> Find More Work
        </Link>
      </div>

      {/* Content */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : myContracts.length === 0 ? (
          <div className="p-16 text-center">
            <i className="bi bi-briefcase text-5xl text-gray-200 block mb-4" />
            <h3 className="font-bricolage font-bold text-xl text-gray-700 mb-2">No active contracts</h3>
            <p className="text-gray-400 text-sm mb-6">
              You haven't been hired for any jobs yet. Check out the job board to find open opportunities.
            </p>
            <Link
              href="/freelancer/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-800 transition-all shadow-lg"
            >
              <i className="bi bi-search" /> Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold">Job Title</th>
                  <th className="px-6 py-4 font-semibold">Milestones</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {myContracts.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 line-clamp-1">{job.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Assigned {new Date(job.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {job.milestones.length} milestone{job.milestones.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-gray-800">
                      {formatAmount(job.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColor[job.status] || "text-gray-700 bg-gray-100"}`}>
                        {job.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/freelancer/jobs/${job.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold transition-all text-xs"
                      >
                        <i className="bi bi-arrow-right-circle" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
