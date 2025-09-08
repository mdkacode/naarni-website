import React from "react";
import { InView } from "react-intersection-observer";
import StaticSEO from "../seo/StaticSEO";
import Footer from "../components/Footer";

const cardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const TermsOfService: React.FC = () => {
  return (
    <>
      <StaticSEO path="/terms" />
      <div className="text-[#111827] bg-[#F9F7F7] pt-10">
      <InView triggerOnce threshold={0.2}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } flex flex-col items-center w-full px-6 py-20`}
          >
            <div
              className="w-full md:w-4/5 text-center p-8 rounded-2xl shadow-lg"
              style={cardStyle}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-[#1E3A8A]">
                Terms of Service
              </h1>
              <p className="mt-6 text-[#374151] text-lg leading-relaxed max-w-2xl mx-auto">
                These Terms govern your use of NaArNi’s website and services. By accessing our platform, you agree to these terms.
              </p>
            </div>
          </section>
        )}
      </InView>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-10 text-[#374151] text-base leading-relaxed">
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">1. Use of Services</h2>
            <p>You agree to use our services only for lawful purposes and in compliance with all applicable laws and regulations.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">2. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">3. Intellectual Property</h2>
            <p>All content on this site is the property of NaArNi and is protected by intellectual property laws. Unauthorized use is prohibited.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">4. Limitation of Liability</h2>
            <p>We are not liable for any damages arising from the use or inability to use our services.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">5. Termination</h2>
            <p>We reserve the right to terminate or suspend your access to our services at any time, without notice or liability.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">6. Changes</h2>
            <p>We may modify these Terms from time to time. Continued use of our services means you accept any changes made.</p>
          </div>
          <p className="text-sm text-gray-600 pt-6">Last updated: August 7, 2025</p>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default TermsOfService;
