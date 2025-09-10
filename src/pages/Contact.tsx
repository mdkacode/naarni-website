import React from "react";
import Lottie from "react-lottie-player";
import StaticSEO from "../seo/StaticSEO";
import ContactAnim from "../assets/lotties/contact-support.json";
// import Map from "../assets/lotties/map-location.json";
import { InView } from "react-intersection-observer";
import Footer from "../components/Footer";

const cardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const Contact: React.FC = () => {
  const palette = {
    background: "#F9F7F7",
    secondary: "#DBE2EF",
    primary: "#3F72AF",
    dark: "#112D4E",
  };

  return (
    <>
      <StaticSEO path="/contact" />
      <div className="pt-1 text-[#111827]" style={{ backgroundColor: palette.background }}>
      {/* Hero Section */}
      <InView triggerOnce threshold={0.2}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20`}
          >
            <div className="w-full md:w-1/2 text-center md:text-left p-6 rounded" style={cardStyle}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E40AF] leading-snug">
                Get in{" "}
                <span className="bg-[#3B82F6] text-white px-3 rounded-lg">Touch</span>
              </h1>
              <p className="mt-4 text-[#1F2937] max-w-md mx-auto md:mx-0 text-base sm:text-lg">
                Reach out to us for product enquiries or just to say hello.
              </p>
            </div>
            <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <Lottie
                loop={false}
                play={false}
                animationData={ContactAnim}
                className="w-full max-w-xs sm:max-w-md md:max-w-lg"
              />
            </div>
          </section>
        )}
      </InView>

      {/* Contact Info */}
      <section className="py-16 bg-[#CBD5E1]/30">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF]">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mt-10 px-4 sm:px-6">
                {[
                  {
                    title: "Email",
                    value: "website@naarni.in",
                  },
                  {
                    title: "Office Location ",
                    value:
                      "6th floor, Sakti Statesman, Marathahalli - Sarjapur Outer Ring Rd, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103",
                  },
                ].map((info, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-6 text-center shadow hover:shadow-lg hover:scale-105 transition bg-white"
                  >
                    <h3 className="text-lg font-semibold text-[#1E40AF]">{info.title}</h3>
                    <p className="text-[#111827] mt-2 text-sm sm:text-base">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section>

      {/* Visit Us */}
      <section className="py-16 bg-[#CBD5E1]/30">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } max-w-6xl mx-auto px-4 sm:px-6`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF]">Visit Us</h2>
              <div className="flex flex-col mt-10 gap-8">
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    title="NaArni Office Map"
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3888.756058499364!2d77.66506397320866!3d12.923394115937104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU1JzI0LjIiTiA3N8KwNDAnMDMuNSJF!5e0!3m2!1sen!2sin!4v1753354612757!5m2!1sen!2sin"
                    className="absolute top-0 left-0 w-full h-full rounded-xl shadow"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}
        </InView>
      </section>
      

      <Footer />
      </div>
    </>
  );
};

export default Contact;
