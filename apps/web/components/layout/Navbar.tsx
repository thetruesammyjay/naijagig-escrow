"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { WalletConnect } from "../wallet/WalletConnect";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const role = (session?.user as any)?.role as string | undefined;
  const dashboardHref = role === "freelancer" ? "/freelancer" : "/client";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="nav-blob rounded-full px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/naijagig-escrow.png"
              alt="NaijaGig Escrow Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 font-medium text-sm text-gray-600">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`hover:text-primary transition-colors ${
                  pathname === link.href ? "text-primary font-semibold" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth-aware links */}
            <div className="flex items-center gap-4 ml-4">
              <WalletConnect />
              {isAuthenticated ? (
                <Link
                  href={dashboardHref}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-all font-semibold flex items-center gap-2"
                >
                  <i className="bi bi-grid-1x2" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-all font-semibold"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile: wallet + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <WalletConnect />
            <button
              id="mobile-menu-btn"
              className="text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <i
                className={`bi ${
                  mobileMenuOpen ? "bi-x-lg" : "bi-list"
                } text-3xl`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="absolute top-full left-0 right-0 mt-2 px-4 lg:hidden"
          >
            <div className="nav-blob rounded-3xl p-6 flex flex-col gap-4 text-center shadow-xl">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium text-gray-700 hover:text-primary py-2 border-b border-gray-100 ${
                    pathname === link.href ? "text-primary font-semibold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <hr className="my-2" />

              {isAuthenticated ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-primary text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <i className="bi bi-grid-1x2" />
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-primary py-2"
                  >
                    <i className="bi bi-box-arrow-in-right mr-2" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-primary text-white px-4 py-3 rounded-xl hover:bg-green-800 text-center font-semibold"
                  >
                    Register Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}