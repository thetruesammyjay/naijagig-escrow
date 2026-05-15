"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Show nothing while session is loading or redirecting
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <i className="bi bi-arrow-repeat animate-spin text-3xl text-primary" />
          <p className="text-gray-500 text-sm font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  const isFreelancer = user?.role === "freelancer";
  const baseRoute = isFreelancer ? "/freelancer" : "/client";

  const navLinks = isFreelancer
    ? [
        { name: "Dashboard", href: "/freelancer", icon: "bi-grid-1x2" },
        { name: "Find Jobs", href: "/freelancer/jobs", icon: "bi-search" },
        {
          name: "My Contracts",
          href: "/freelancer/contracts",
          icon: "bi-briefcase",
        },
        { name: "Wallet", href: "/freelancer/wallet", icon: "bi-wallet2" },
      ]
    : [
        { name: "Dashboard", href: "/client", icon: "bi-grid-1x2" },
        { name: "My Jobs", href: "/client/jobs", icon: "bi-card-list" },
        {
          name: "Post Job",
          href: "/client/jobs/new",
          icon: "bi-plus-circle",
        },
        {
          name: "Escrow Wallet",
          href: "/client/wallet",
          icon: "bi-shield-check",
        },
      ];

  const currentPageName =
    pathname === baseRoute
      ? "Dashboard"
      : navLinks.find((l) => l.href === pathname)?.name ?? "Dashboard";

  const SidebarContent = () => (
    <>
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="px-3 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          {isFreelancer ? "Freelancer" : "Client"} Portal
        </p>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                isActive
                  ? "bg-green-50 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <i
                className={`bi ${link.icon} ${
                  isActive ? "text-primary" : "text-gray-400"
                }`}
              />
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-200">
        {/* User info */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <i className="bi bi-box-arrow-right" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-outfit mt-[-96px] pt-24">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 shadow-sm z-10 h-full">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <Link href="/">
            <Image
              src="/naijagig-escrow.png"
              alt="Logo"
              width={150}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-green-200/20 blur-3xl float-animation" />
        </div>

        {/* Header */}
        <header className="bg-white/80 backdrop-blur border-b border-gray-200 z-10 flex items-center justify-between p-4 px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-600 focus:outline-none"
              aria-label="Open menu"
            >
              <i className="bi bi-list text-2xl" />
            </button>
            <h1 className="font-bricolage text-xl font-bold text-gray-800 hidden sm:block">
              {currentPageName}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="text-gray-400 hover:text-primary transition-colors relative"
              aria-label="Notifications"
            >
              <i className="bi bi-bell text-xl" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div
              className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md text-sm"
              title={user?.name}
            >
              {user?.name?.charAt(0).toUpperCase() ?? (isFreelancer ? "F" : "C")}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10 relative">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 max-w-[80%] h-full bg-white flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <Image
                src="/naijagig-escrow.png"
                alt="Logo"
                width={120}
                height={30}
                className="h-6 w-auto"
              />
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close menu"
              >
                <i className="bi bi-x-lg text-xl" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}