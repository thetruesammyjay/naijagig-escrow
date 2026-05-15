import React from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/layout/Footer";

export default function Home() {
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

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Trust Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-2 bg-green-50 border border-green-200 text-green-700">
            <i className="bi bi-shield-check text-green-700"></i>
            <span className="text-xs font-bold tracking-wide uppercase">100% Trustless Escrow</span>
          </div>
          
          {/* Brand Name (Mobile Emphasis) */}
          <div className="animate-fade-in-up block sm:hidden mb-6">
            <h2 className="font-bricolage font-extrabold text-3xl tracking-tight gradient-text">NAIJAGIG ESCROW</h2>
          </div>

          {/* Main Headline */}
          <h1 className="animate-fade-in-up font-bricolage font-extrabold text-5xl sm:text-6xl md:text-7xl leading-tight mb-6 text-gray-900">
            Connecting <span className="gradient-text">Skilled Hands</span>
            <br />with Security
          </h1>

          <p className="animate-fade-in-up font-outfit text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Nigeria&apos;s foremost platform connecting verified artisans, skilled professionals, and contractors with secure Stellar blockchain escrow payments.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/register?type=freelancer" className="w-full sm:w-auto px-6 py-4 bg-orange-600 text-white rounded-full font-bold text-base lg:text-lg hover:bg-orange-700 transition-all hover-scale shadow-xl shadow-orange-200 flex items-center justify-center gap-2">
              <i className="bi bi-tools"></i>
              <span>Register as a Freelancer</span>
            </Link>
            <Link href="/register?type=client" className="w-full sm:w-auto px-6 py-4 bg-primary text-white rounded-full font-bold text-base lg:text-lg hover:bg-green-800 transition-all hover-scale shadow-xl shadow-green-200 flex items-center justify-center gap-2">
              <i className="bi bi-building"></i> Post a Job 
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="animate-fade-in-up grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="feature-card rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-primary font-bricolage">10K+</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Freelancers</div>
            </div>
            <div className="feature-card rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-primary font-bricolage">5K+</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Projects Completed</div>
            </div>
            <div className="feature-card rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-primary font-bricolage">100%</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Secure Escrow</div>
            </div>
            <div className="feature-card rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-primary font-bricolage">0</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Payment Frauds</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Categories */}
      <section className="relative z-10 py-10 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bricolage font-bold text-2xl text-gray-900">Popular Services</h2>
            <Link href="/services" className="text-primary text-sm font-semibold hover:underline">View All</Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x">
            {[
              { id: "dev", icon: "bi-code-slash", label: "Developer" },
              { id: "design", icon: "bi-palette", label: "Designer" },
              { id: "writing", icon: "bi-pen", label: "Writer" },
              { id: "marketing", icon: "bi-megaphone", label: "Marketing" },
              { id: "electrician", icon: "bi-lightning-charge", label: "Electrician" },
              { id: "plumber", icon: "bi-droplet", label: "Plumber" },
              { id: "mechanic", icon: "bi-wrench", label: "Mechanic" },
              { id: "carpenter", icon: "bi-hammer", label: "Carpenter" }
            ].map((service) => (
              <Link key={service.id} href={`/services#${service.id}`} className="snap-start flex-shrink-0 w-32 group cursor-pointer">
                <div className="w-32 h-32 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-green-50 group-hover:scale-105 transition-all duration-300 border border-gray-100">
                  <i className={`bi ${service.icon} text-4xl text-gray-400 group-hover:text-primary transition-colors`}></i>
                </div>
                <p className="text-center text-sm font-medium text-gray-700 group-hover:text-primary">{service.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative z-10 py-20 px-4 bg-grid">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="animate-fade-in-up font-bricolage font-bold text-3xl md:text-4xl mb-4 text-gray-900">
              Why Choose <span className="gradient-text">NaijaGig Escrow?</span>
            </h2>
            <p className="animate-fade-in-up text-gray-500 text-lg max-w-2xl mx-auto">
              We&apos;ve built a platform that prioritizes integrity, trust, and secure payments via blockchain technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="animate-fade-in-up feature-card rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-6 text-green-700 relative z-10">
                <i className="bi bi-shield-lock-fill text-2xl"></i>
              </div>
              <h3 className="font-bricolage font-bold text-xl mb-3 text-gray-900">Trustless Escrow</h3>
              <p className="text-gray-600 leading-relaxed">Funds are locked in a secure smart contract until milestones are approved. No more payment disputes.</p>
            </div>

            <div className="animate-fade-in-up feature-card rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mb-6 text-yellow-600 relative z-10">
                <i className="bi bi-currency-exchange text-2xl"></i>
              </div>
              <h3 className="font-bricolage font-bold text-xl mb-3 text-gray-900">Stellar Network</h3>
              <p className="text-gray-600 leading-relaxed">Powered by the Stellar blockchain for fast, low-cost multi-currency settlements globally.</p>
            </div>

            <div className="animate-fade-in-up feature-card rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 text-blue-600 relative z-10">
                <i className="bi bi-patch-check-fill text-2xl"></i>
              </div>
              <h3 className="font-bricolage font-bold text-xl mb-3 text-gray-900">Verified Pros</h3>
              <p className="text-gray-600 leading-relaxed">Work with pre-vetted professionals maintaining high success rates and quality reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fade-in-up feature-card rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden border-2 border-green-100">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50 to-transparent opacity-50 z-0"></div>
            
            <div className="relative z-10">
              <h2 className="font-bricolage font-bold text-4xl md:text-5xl mb-6 text-gray-900">
                Ready to Work <span className="text-primary">Securely?</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Whether you&apos;re looking for skilled workers or seeking employment opportunities, NaijaGig Escrow gives you peace of mind.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-green-800 transition-all hover-scale shadow-xl shadow-green-200 flex items-center justify-center gap-2">
                  <i className="bi bi-person-plus"></i> Get Started Today
                </Link>
                <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all hover-scale flex items-center justify-center gap-2">
                  <i className="bi bi-envelope"></i> Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}