import React from "react";
import Lottie from "react-lottie-player";
import StaticSEO from "../seo/StaticSEO";
import ContactAnim from "../assets/lotties/contact-support.json";
import { InView } from "react-intersection-observer";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import Footer from "../components/Footer";

const Contact: React.FC = () => {
  return (
    <>
      <StaticSEO path="/contact" />
      <div className="pt-1 text-[#111827] bg-[#F9F7F7]">

        {/* Hero Section */}
        <InView triggerOnce threshold={0.2}>
          {({ inView, ref }) => (
            <section
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28`}
            >
              <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Left content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <div className="inline-block px-4 py-1.5 bg-blue-100 text-[#1E40AF] text-sm font-medium rounded-full mb-6">
                    We'd love to hear from you
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#112D4E] leading-tight">
                    Get in{" "}
                    <span className="relative">
                      <span className="relative z-10 text-[#1E40AF]">Touch</span>
                      <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-200/60 -z-0 rounded" />
                    </span>
                  </h1>
                  <p className="mt-6 text-[#4B5563] max-w-lg mx-auto lg:mx-0 text-lg leading-relaxed">
                    Whether you have questions about our EV solutions, want to explore partnerships, or just want to say hello — we're here to help.
                  </p>
                </div>

                {/* Right animation */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <Lottie
                    loop
                    play
                    animationData={ContactAnim}
                    className="w-full max-w-sm sm:max-w-md"
                  />
                </div>
              </div>
            </section>
          )}
        </InView>

        {/* Contact Cards */}
        <section className="py-20 bg-gradient-to-b from-[#F9F7F7] to-[#EEF2FF]">
          <InView triggerOnce threshold={0.1}>
            {({ inView, ref }) => (
              <div
                ref={ref}
                className={`transition-all duration-1000 ease-out transform ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                } max-w-5xl mx-auto px-4 sm:px-6`}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#112D4E] mb-4">
                  Reach Out To Us
                </h2>
                <p className="text-center text-[#6B7280] mb-14 max-w-xl mx-auto">
                  Choose the way that works best for you
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Email Card */}
                  <a
                    href="mailto:creds@naarni.com"
                    className="group block rounded-2xl p-8 text-center bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-300">
                      <Mail className="w-7 h-7 text-[#1E40AF]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#112D4E] mb-2">Email Us</h3>
                    <p className="text-[#3B82F6] font-medium group-hover:underline">
                      creds@naarni.com
                    </p>
                  </a>

                  {/* Phone Card */}
                  <a
                    href="tel:+919902459388"
                    className="group block rounded-2xl p-8 text-center bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors duration-300">
                      <Phone className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-[#112D4E] mb-2">Call Us</h3>
                    <p className="text-[#3B82F6] font-medium group-hover:underline">
                      +91 9902459388
                    </p>
                  </a>

                  {/* Location Card */}
                  <a
                    href="https://maps.app.goo.gl/2Jr9k2YNAqFHbjzVA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl p-8 text-center bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors duration-300">
                      <MapPin className="w-7 h-7 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-bold text-[#112D4E] mb-2">Visit Us</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      Bengaluru, Karnataka
                    </p>
                  </a>
                </div>
              </div>
            )}
          </InView>
        </section>

        {/* Map Section with Address */}
        <section className="py-20 bg-[#EEF2FF]">
          <InView triggerOnce threshold={0.1}>
            {({ inView, ref }) => (
              <div
                ref={ref}
                className={`transition-all duration-1000 ease-out transform ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                } max-w-6xl mx-auto px-4 sm:px-6`}
              >
                {/* Address Block */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 text-[#1E40AF] text-sm font-medium rounded-full mb-6 shadow-sm">
                    <MapPin className="w-4 h-4" />
                    Our Office
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#112D4E] leading-tight max-w-3xl mx-auto">
                    6th Floor, Sakti Statesman
                  </h2>
                  <p className="mt-4 text-lg sm:text-xl text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
                    Marathahalli - Sarjapur Outer Ring Rd, Green Glen Layout,
                    <br className="hidden sm:block" /> Bellandur, Bengaluru, Karnataka 560103
                  </p>
                  <a
                    href="https://maps.app.goo.gl/2Jr9k2YNAqFHbjzVA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#1E40AF] text-white font-medium rounded-full hover:bg-[#1E3A8A] transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Get Directions
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                  <div className="relative w-full" style={{ paddingTop: "45%" }}>
                    <iframe
                      title="NaArni Office Map"
                      src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3888.756058499364!2d77.66506397320866!3d12.923394115937104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU1JzI0LjIiTiA3N8KwNDAnMDMuNSJF!5e0!3m2!1sen!2sin!4v1753354612757!5m2!1sen!2sin"
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ filter: "grayscale(100%) contrast(1.1)" }}
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
