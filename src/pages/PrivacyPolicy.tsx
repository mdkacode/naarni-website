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

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <StaticSEO path="/privacy-policy" />
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
                Privacy Policy
              </h1>
              <p className="mt-6 text-[#374151] text-lg leading-relaxed max-w-2xl mx-auto">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.
              </p>
            </div>
          </section>
        )}
      </InView>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-10 text-[#374151] text-base leading-relaxed">
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly (e.g., when signing up or contacting support), and technical data (e.g., cookies, browser type, device info).</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">2. Use of Information</h2>
            <p>We use your information to provide and improve our services, communicate with you, ensure security, and comply with legal obligations.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">3. Data Sharing</h2>
            <p>We do not sell your data. We may share with trusted third parties (e.g., infrastructure providers) under strict confidentiality agreements.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">4. Data Security</h2>
            <p>We implement industry-standard practices to protect your information from unauthorized access, loss, or misuse.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1E40AF] mb-2">5. Your Rights</h2>
            <p>You have the right to access, update, or delete your data. Contact us to make such requests.</p>
          </div>
          <p className="text-sm text-gray-600 pt-6">Last updated: August 7, 2025</p>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
