"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isFreelancer: boolean;
}

export function Sidebar({ isOpen, setIsOpen, isFreelancer }: SidebarProps) {
  const pathname = usePathname();
  const baseRoute = isFreelancer ? "/freelancer" : "/client";

  const navLinks = isFreelancer
    ? [
        { name: "Dashboard", href: "/freelancer", icon: "bi-grid-1x2" },
        { name: "My Jobs", href: "/freelancer/jobs", icon: "bi-briefcase" },
        { name: "Contracts", href: "/freelancer/contracts", icon: "bi-file-earmark-text" },
        { name: "Wallet", href: "/freelancer/wallet", icon: "bi-wallet2" },
      ]
    : [
        { name: "Dashboard", href: "/client", icon: "bi-grid-1x2" },
        { name: "Post Job", href: "/client/jobs/new", icon: "bi-plus-circle" },
        { name: "My Postings", href: "/client/jobs", icon: "bi-briefcase" },
        { name: "Wallet & Escrow", href: "/client/wallet", icon: "bi-shield-check" },
      ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href={baseRoute} className="font-bricolage font-bold text-2xl text-primary flex items-center gap-2">
            <i className="bi bi-shield-lock-fill"></i> NaijaGig
          </Link>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-900 text-2xl"
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            {isFreelancer ? "Freelancer Menu" : "Client Menu"}
          </div>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive 
                      ? "bg-green-50 text-primary" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <i className={`bi ${link.icon} text-lg`}></i>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <Link 
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <i className="bi bi-gear text-lg"></i>
            Settings
          </Link>
          <button 
            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <i className="bi bi-box-arrow-right text-lg"></i>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
