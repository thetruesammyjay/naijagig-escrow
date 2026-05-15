import React from "react";
import Link from "next/link";
import { JobStatusBadge } from "./JobStatusBadge";

interface JobCardProps {
  id: string;
  title: string;
  clientName: string;
  budget: number;
  currency?: string;
  status: "open" | "in-progress" | "pending-review" | "completed" | "disputed";
  createdAt: string;
  description: string;
  tags?: string[];
  href: string;
}

export function JobCard({
  id,
  title,
  clientName,
  budget,
  currency = "₦",
  status,
  createdAt,
  description,
  tags = [],
  href
}: JobCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-gray-100 hover:border-primary/20 transition-all hover:shadow-md flex flex-col h-full">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <Link href={href} className="group">
            <h3 className="text-xl font-bricolage font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span><i className="bi bi-person mr-1"></i> {clientName}</span>
            <span>&bull;</span>
            <span><i className="bi bi-clock mr-1"></i> {createdAt}</span>
          </p>
        </div>
        <div className="text-right whitespace-nowrap">
          <div className="font-bricolage font-bold text-lg text-gray-900">
            {currency}{budget.toLocaleString()}
          </div>
          <div className="mt-1">
            <JobStatusBadge status={status} />
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
        {description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="flex flex-wrap gap-2 text-xs">
          {tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md font-medium">
              +{tags.length - 3}
            </span>
          )}
        </div>
        <Link 
          href={href}
          className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
        >
          View Details <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}
