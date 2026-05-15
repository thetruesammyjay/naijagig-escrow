import React from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    href: string;
    icon?: string;
  };
  backLink?: {
    label: string;
    href: string;
  };
}

export function PageHeader({ title, description, actionButton, backLink }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
      <div>
        {backLink && (
          <Link 
            href={backLink.href}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-3 transition-colors"
          >
            <i className="bi bi-arrow-left mr-2"></i>
            {backLink.label}
          </Link>
        )}
        <h1 className="text-3xl font-bricolage font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-500 mt-2">{description}</p>}
      </div>
      
      {actionButton && (
        <div>
          <Link
            href={actionButton.href}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition-colors gap-2"
          >
            {actionButton.icon && <i className={`bi ${actionButton.icon}`}></i>}
            {actionButton.label}
          </Link>
        </div>
      )}
    </div>
  );
}
