import React from "react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full blur-3xl opacity-20 float-animation bg-primary" 
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20 float-animation float-delay-1 bg-accent" 
        />
      </div>

      <section className="relative z-10 pt-28 pb-20 px-4 min-h-[80vh] flex flex-col justify-center">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 bg-green-50 border border-green-200 text-green-700">
            <i className="bi bi-chat-dots text-green-700"></i>
            <span className="text-xs font-bold tracking-wide uppercase">Get In Touch</span>
          </div>

          <h1 className="animate-fade-in-up font-bricolage font-extrabold text-5xl sm:text-6xl leading-tight mb-6 text-gray-900">
            Contact <span className="gradient-text">NaijaGig Escrow</span>
          </h1>

          <p className="animate-fade-in-up font-outfit text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed">
            Have questions about our trustless escrow protocol, partnership opportunities, or need help with a dispute? Reach out to the builders directly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            
            {/* Email */}
            <a href="mailto:thetruesammyjay@gmail.com" className="feature-card rounded-3xl p-8 flex flex-col items-center group hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-orange-200">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                <i className="bi bi-envelope text-3xl"></i>
              </div>
              <h3 className="font-bricolage font-bold text-2xl mb-2 text-gray-900">Email Us</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">For general inquiries, support, or partnership discussions.</p>
              <span className="mt-auto text-orange-600 font-semibold text-sm group-hover:underline flex items-center gap-2">
                thetruesammyjay@gmail.com
                <i className="bi bi-arrow-up-right"></i>
              </span>
            </a>

            {/* Telegram */}
            <a href="https://t.me/sammyjayisthename" target="_blank" rel="noopener noreferrer" className="feature-card rounded-3xl p-8 flex flex-col items-center group hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <i className="bi bi-telegram text-3xl"></i>
              </div>
              <h3 className="font-bricolage font-bold text-2xl mb-2 text-gray-900">Telegram</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Direct message for quick chats and instant project updates.</p>
              <span className="mt-auto text-blue-600 font-semibold text-sm group-hover:underline flex items-center gap-2">
                @sammyjayisthename
                <i className="bi bi-arrow-up-right"></i>
              </span>
            </a>

            {/* GitHub */}
            <a href="https://github.com/thetruesammyjay/naijagig-escrow" target="_blank" rel="noopener noreferrer" className="feature-card rounded-3xl p-8 flex flex-col items-center group hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-gray-300">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 text-gray-700 group-hover:bg-gray-800 group-hover:text-white transition-all duration-300">
                <i className="bi bi-github text-3xl"></i>
              </div>
              <h3 className="font-bricolage font-bold text-2xl mb-2 text-gray-900">GitHub</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Report bugs, view the smart contract architecture, or read our docs.</p>
              <span className="mt-auto text-gray-700 font-semibold text-sm group-hover:underline flex items-center gap-2">
                thetruesammyjay/naijagig-escrow
                <i className="bi bi-arrow-up-right"></i>
              </span>
            </a>

          </div>

          <div className="mt-16 animate-fade-in-up">
            <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline px-6 py-3 rounded-full hover:bg-green-50 transition-colors">
              <i className="bi bi-arrow-left"></i> Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
