"use client";
import React from "react";
import Link from "next/link";

export default function ClientDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between border-l-4 border-l-primary bg-gradient-to-r from-white to-green-50/30">
        <div>
          <h2 className="text-2xl font-bricolage font-bold text-gray-900 mb-1">Welcome back, TechCorp!</h2>
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
          <div className="text-3xl font-bricolage font-bold text-gray-900">3</div>
          <p className="text-sm text-green-600 mt-2"><i className="bi bi-arrow-up-right"></i> 1 new this week</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm">Total in Escrow</h3>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-primary">
              <i className="bi bi-shield-lock"></i>
            </div>
          </div>
          <div className="text-3xl font-bricolage font-bold text-gray-900">₦450,000</div>
          <p className="text-sm text-gray-500 mt-2">Locked in Stellar smart contracts</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-semibold text-sm">Milestones Pending Review</h3>
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <i className="bi bi-clock-history"></i>
            </div>
          </div>
          <div className="text-3xl font-bricolage font-bold text-gray-900">2</div>
          <p className="text-sm text-yellow-600 mt-2">Requires your approval</p>
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <h3 className="font-bricolage font-bold text-lg text-gray-900 mb-4">Recent Jobs</h3>
        <div className="glass-card rounded-2xl overflow-hidden">
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
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">E-commerce Website Build</td>
                  <td className="p-4 text-gray-600">Dev Adebayo</td>
                  <td className="p-4 text-gray-600 font-medium">₦250,000</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold">In Progress</span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href="/client/jobs/1" className="text-primary hover:underline font-semibold">Manage</Link>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">Brand Logo Design</td>
                  <td className="p-4 text-gray-600">Creative Chi</td>
                  <td className="p-4 text-gray-600 font-medium">₦50,000</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold">Pending Review</span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href="/client/jobs/2" className="text-primary hover:underline font-semibold">Review</Link>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">Plumbing Fixed App</td>
                  <td className="p-4 text-gray-600">John Plumb</td>
                  <td className="p-4 text-gray-600 font-medium">₦150,000</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">Completed</span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href="/client/jobs/3" className="text-gray-500 hover:underline font-semibold">View</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}