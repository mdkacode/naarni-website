import React from "react";
import Lottie from "react-lottie-player";
import StaticSEO from "../seo/StaticSEO";
// import EVFuture from "../assets/lotties/ev-future.json";
import Wallet from "../assets/lotties/wallet.json";
import Maintenance from "../assets/lotties/maintenance.json";
import Charging from "../assets/lotties/charging.json";
import Battery from "../assets/lotties/battery.json";
// import CO2 from "../assets/lotties/co2.json";
// import GreenEnergy from "../assets/lotties/green-energy.json";
// import EarthAnim from "../assets/lotties/earth-sustainability.json";
import { InView } from "react-intersection-observer";
import Footer from "../components/Footer";
import AnkitImg from "../assets/founders/ankit.png";
import AnandImg from "../assets/founders/anand.jpg";
// import EVBus from "../assets/lotties/ev-bus.json";
// import EVTruck from "../assets/lotties/ev-truck.json";
import { Linkedin } from "lucide-react";
import b3 from "../assets/about/b3.png";
import b2 from "../assets/about/b2.png";
import b1 from "../assets/about/b1.jpg";

const cardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const About: React.FC = () => {
  const founders = [
    {
      name: "Ankit Singhvi",
      role: "CEO, NaArNi",
      img: AnkitImg,
      bio: "IIT-Bombay, MBA-Harvard | Ex-CEO Mozev (exit to Greencell) | ITC, McKinsey",
      linkedin: "https://www.linkedin.com/in/ankit-singhvi154/",
    },
    {
      name: "Anand Ayyadurai",
      role: "COO, NaArNi",
      img: AnandImg,
      bio: "IIM-Ahmedabad | Ex-CEO Vogo (exit to Chalo) |  Flipkart",
      linkedin: "https://www.linkedin.com/in/anandayyadurai/",
    },
  ];

  const cards = [
    {
      title: "Financing",
      desc: "Access to long-term, cost-effective EV financing for fleet operators.",
      anim: Wallet,
      color: "bg-purple-50",
    },
    {
      title: "Maintenance",
      desc: "High-voltage AMC & full vehicle-life support to ensure reliability.",
      anim: Maintenance,
      color: "bg-green-50",
    },
    {
      title: "Charging",
      desc: "Reliable, fast, and cost-effective charging network support.",
      anim: Charging,
      color: "bg-purple-50",
    },
    {
      title: "Battery Assurance",
      desc: "Guaranteed battery replacement & performance reliability.",
      anim: Battery,
      color: "bg-green-50",
    },
  ];

  // const impactStats = [
  //   { value: "100M+ km", label: "Electric Bus Runs", anim: GreenEnergy },
  //   { value: "15,00+ tons", label: "CO2 Saved", anim: CO2 },
  //   { value: "300+", label: "Charging Stations Supported", anim: EarthAnim },
  // ];

  const milestones = [
    {
      year: "2015 - 2021",
      title: "Mozev: India's First Intercity EV Bus OEM",
      details: ["25 Buses deployed with BYD", "Pipeline of 150 buses"],
      image: b1,
    },
    {
      year: "2021 - Now",
      title: "Greencell Acquires Mozev",
      details: [
        "300+ NueGo Buses connecting 100+ cities",
        "100M+ km runs | 500 km+ per day",
        "Largest intercity EV bus operator in India",
      ],
      image: b2,
    },
    {
      year: "2024 - Now",
      title: "NaArNi Journey Begins",
      details: [
        "Entry into Intercity Buses (350,000+ potential)",
        "Helping operators switch to EV",
        "Trucks coming soon!",
      ],
      image: b3,
    },
  ];

  const marketStats = [
    { value: "$2 Tn", label: "HCV Market Opportunity" },
    { value: "5 Mn", label: "VEHICLES IN INDIA ARE HCV" },
    { value: "40%", label: "CONTRIBUTION TO DIESEL CONSUMPTION" },
    { value: "1 Mn", label: "BUS AND TRUCK OPERATORS" },
    { value: "80%", label: "OF OPERATOR'S EXPENSES IS  RUNNING COST" },
  ];

  return (
    <>
      <StaticSEO path="/about" />
      <div className="text-[#111827] bg-[#F9F7F7]">
      {/* Hero Section */}
      <InView triggerOnce threshold={0.2}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } flex flex-col items-center justify-between w-full px-6 py-20`}
          >
            <div
              className="w-full md:w-4/5 text-center md:text-left p-8 rounded-2xl shadow-lg"
              style={cardStyle}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-snug text-[#1E3A8A] text-center">
                About {" "}
                <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25">
                  NaArNi
                </span>
              </h1>
              <p className="mt-6 text-center mx-auto max-w-2xl text-[#374151] text-lg leading-relaxed">
                NaArNi is transforming{" "}
                <strong>Heavy Commercial Vehicles (HCVs)</strong> with best-in-class
                electric buses. Our mission is to make{" "}
                <strong>EVs the default choice for fleet operators</strong> through
                reliable products, cost-effective financing, maintenance, and charging solutions.
              </p>
            </div>
          </section>
        )}
      </InView>

      {/* Founders Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } max-w-6xl mx-auto px-6`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF] mb-4">
                Meet Our Founders
              </h2>
              <p className="text-center text-[#374151] text-lg mb-12">
                Second Time Entrepreneurs in the Electric Vehicle Space
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {founders.map((f, i) => (
                  <div
                    key={i}
                    className="group relative p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ease-out bg-white border border-gray-100"
                  >
                    <div className="text-center">
                      <div className="relative inline-block mb-6">
                        <img
                          src={f.img}
                          alt={f.name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg group-hover:border-blue-300 transition-all duration-300"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <h3 className="text-2xl font-bold text-[#1E40AF] mb-2">{f.name}</h3>
                      <p className="text-[#3B82F6] font-semibold text-lg mb-3">{f.role}</p>
                      <p className="text-[#6B7280] text-sm leading-relaxed mb-6">{f.bio}</p>
                      <a
                        href={f.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
                      >
                        <Linkedin size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section>

      {/* HCV Market Stats */}
      <section className="py-20 bg-white">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } max-w-6xl mx-auto px-6`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF] mb-4">
                The Heavy Commercial Vehicle Opportunity
              </h2>
              {/* <p className="text-center text-[#374151] text-lg mb-12 max-w-3xl mx-auto">
                Understanding the massive market potential and the critical need for electrification in heavy commercial vehicles.
              </p> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {marketStats.map((stats, i) => (
                  <div
                    key={i}
                    className="group p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-center min-h-[180px] flex flex-col justify-center"
                  >
                    <p className="text-3xl md:text-4xl font-bold text-[#1E40AF] mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {stats.value}
                    </p>
                    <p className="text-[#374151] text-sm font-semibold leading-relaxed uppercase">
                      {stats.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } max-w-6xl mx-auto px-6`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF] mb-4">
                Our Track Record In EV Buses
              </h2>
              <p className="text-center text-[#374151] text-lg mb-12 max-w-3xl mx-auto">
                A proven history of success in the electric vehicle industry with significant milestones and achievements.
              </p>
              <div className="space-y-8">
                {milestones.map((item, i) => (
                  <div
                    key={i}
                    className="group p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ease-out bg-white border border-gray-100"
                  >
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center shadow-lg">
                          {/* <Lottie loop={false} play animationData={item.anim} className="w-20 h-20" /> */}
                          <img src={item.image} alt="visual" className="w-25 h-25 object-contain rounded-lg" />
                        </div>
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <p className="text-[#3B82F6] font-bold text-sm mb-2 bg-blue-100 px-3 py-1 rounded-full inline-block">
                          {item.year}
                        </p>
                        <h3 className="text-xl lg:text-2xl font-bold text-[#1E40AF] mb-4 group-hover:text-blue-600 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <ul className="space-y-2 text-[#374151] text-sm lg:text-base">
                          {item.details.map((point, j) => (
                            <li key={j} className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section>

      {/* Supporting Fleet Operators */}
      <section className="py-20 bg-white">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } max-w-6xl mx-auto px-6`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF] mb-4">
                Supporting Fleet Operators End-to-End
              </h2>
              <p className="text-center text-[#374151] text-lg mb-12 max-w-3xl mx-auto">
                Comprehensive solutions that address every aspect of fleet electrification, from financing to maintenance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((item, i) => (
                  <div
                    key={i}
                    className="group p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Lottie loop={false} play animationData={item.anim} className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1E40AF] mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[#374151] text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section>

      {/* EV Impact */}
      {/* <section className="py-16 bg-[#CBD5E1]/30">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF]">EV Impact</h2>
              <div className="flex flex-wrap justify-center gap-10 mt-10 text-center">
                {impactStats.map((stats, i) => (
                  <div
                    key={i}
                    className="w-52 rounded-xl shadow hover:shadow-lg transition p-4 bg-white"
                  >
                    <Lottie loop={false} play animationData={stats.anim} className="w-24 h-24 mx-auto" />
                    <p className="text-2xl text-[#1E40AF] font-bold">{stats.value}</p>
                    <p className="text-[#111827] text-sm">{stats.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section> */}

      <Footer />
      </div>
    </>
  );
};

export default About;
