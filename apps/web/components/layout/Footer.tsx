import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-8 mt-auto">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-6">
          {/* About Section */}
          <div>
            <Image
              src="/naijagig-escrow.png"
              alt="NaijaGig Escrow Logo"
              width={180}
              height={48}
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <h5 className="text-white text-lg font-semibold mb-3">NaijaGig Escrow</h5>
            <p className="text-gray-400 text-sm mb-4">
              Nigeria&apos;s leading platform connecting verified artisans, contractors, and professionals securely through Trustless Work Escrow.
            </p>
            <div className="flex gap-2 mt-3">
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full text-gray-400 hover:bg-primary hover:border-primary hover:text-white transition">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full text-gray-400 hover:bg-primary hover:border-primary hover:text-white transition">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full text-gray-400 hover:bg-primary hover:border-primary hover:text-white transition">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="text-white font-semibold mb-3">Quick Links</h6>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 text-sm hover:text-white transition"><i className="bi bi-chevron-right text-xs"></i> Home</Link></li>
              <li><Link href="/register" className="text-gray-400 text-sm hover:text-white transition"><i className="bi bi-chevron-right text-xs"></i> Connect as Freelancer</Link></li>
              <li><Link href="/register?type=client" className="text-gray-400 text-sm hover:text-white transition"><i className="bi bi-chevron-right text-xs"></i> Register as Client</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h6 className="text-white font-semibold mb-3">Legal</h6>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 text-sm hover:text-white transition"><i className="bi bi-chevron-right text-xs"></i> Privacy Policy</Link></li>
              <li><Link href="/" className="text-gray-400 text-sm hover:text-white transition"><i className="bi bi-chevron-right text-xs"></i> Terms of Service</Link></li>
              <li><Link href="/" className="text-gray-400 text-sm hover:text-white transition"><i className="bi bi-chevron-right text-xs"></i> Escrow Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h6 className="text-white font-semibold mb-3">Contact Info</h6>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <i className="bi bi-geo-alt-fill text-green-500 mt-1"></i>
                <span>Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-envelope-fill text-green-500"></i>
                <a href="mailto:support@naijagig.com" className="text-gray-400 hover:text-white transition">support@naijagig.com</a>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-clock-fill text-green-500"></i>
                <span>Mon - Sat: 8AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center py-4 text-center lg:text-left">
            <div className="text-gray-400 text-sm">
              <i className="bi bi-c-circle"></i> {currentYear} NaijaGig Escrow. All rights reserved.
            </div>
            <div className="mt-2 lg:mt-0">
              <ul className="flex flex-wrap justify-center gap-1 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white px-3 py-1 transition">Privacy Policy</Link></li>
                <li><span className="text-gray-600">|</span></li>
                <li><Link href="/" className="text-gray-400 hover:text-white px-3 py-1 transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div> 
    </footer>
  );
}