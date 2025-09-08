import React from "react";
import Lottie from "react-lottie-player";
import StaticSEO from "../seo/StaticSEO";
import Analysis from "../assets/lotties/Record-analytic.json";
import EVBus from "../assets/lotties/ev-bus.json";
import EVTruck from "../assets/lotties/ev-truck.json";
import { InView } from "react-intersection-observer";
import Footer from "../components/Footer";

const cardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const TrackRecord: React.FC = () => {
  const milestones = [
    {
      year: "2015 - 2021",
      title: "Mozev: India's First Intercity EV Bus OEM",
      details: ["25 Buses deployed with BYD", "Pipeline of 150 buses"],
      anim: EVBus,
    },
    {
      year: "2021 - Now",
      title: "Greencell Acquires Mozev",
      details: [
        "300+ NueGo Buses connecting 100+ cities",
        "100M+ km runs | 500 km+ per day",
        "Largest intercity EV bus operator in India",
      ],
      anim: EVBus,
    },
    {
      year: "2024 - Now",
      title: "NaArNi Journey Begins",
      details: [
        "Entry into Intercity Buses (350,000+ potential)",
        "Helping operators switch to EV",
        "Trucks coming soon!",
      ],
      anim: EVTruck,
    },
  ];

  const marketStats = [
    { value: "$2 Tn", label: "HCV Market Opportunity" },
    { value: "5 Mn", label: "VEHICLES IN INDIA ARE HCV" },
    { value: "40%", label: "CONTRIBUTION TO DIESEL CONSUMPTION" },
    { value: "80%", label: "OF OPERATOR'S EXPENSES IS  RUNNING COST" },
  ];

  return (
    <>
      <StaticSEO path="/track-record" />
      <div className="text-[#111827] bg-[#F9F7F7]">
      {/* Hero Section */}
      <InView triggerOnce threshold={0.4}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20`}
          >
            <div className="md:w-2/3 text-center md:text-left p-6 rounded mt-9" style={cardStyle}>
              <h1 className="text-5xl md:text-6xl font-bold leading-snug text-[#1E3A8A]">
                Our{" "}
                <span className="px-3 rounded bg-[#3B82F6] text-white">Track Record</span>
              </h1>
              <p className="mt-4 max-w-md text-[#374151]">
                Over a decade of innovation in Electric Mobility, from India's first intercity EV buses to a future of Heavy EV Trucks.
              </p>
            </div>

            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <Lottie loop play animationData={Analysis} className="w-80 md:w-[450px]" />
            </div>
          </section>
        )}
      </InView>

      {/* Milestones Section */}
      <section className="py-16 bg-[#E2E8F0]">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } max-w-6xl mx-auto px-4`}
            >
              <h2 className="text-4xl font-bold text-center text-[#1E40AF]">
                Milestones in EV Innovation
              </h2>
              <div className="mt-10 space-y-8">
                {milestones.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition bg-white"
                  >
                    <div className="md:w-1/3 flex justify-center">
                      <Lottie loop play animationData={item.anim} className="w-36 h-36" />
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-[#1E3A8A] font-bold text-sm">{item.year}</p>
                      <h3 className="text-xl font-semibold text-[#1E40AF]">{item.title}</h3>
                      <ul className="mt-2 text-[#374151] list-disc list-inside text-sm">
                        {item.details.map((point, j) => (
                          <li key={j}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section>

      {/* HCV Market Stats Section */}
      <section className="py-16 bg-[#E2E8F0]">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } max-w-6xl mx-auto px-4`}
            >
              <h2 className="text-4xl font-bold text-center text-[#1E40AF]">
                The HCV Opportunity
              </h2>
              <div className="flex flex-wrap justify-center gap-8 mt-10">
                {marketStats.map((stats, i) => (
                  <div
                    key={i}
                    className="w-40 text-center rounded-xl p-4 shadow hover:shadow-lg hover:scale-105 transition bg-white"
                  >
                    <p className="text-2xl font-bold text-[#1E40AF]">{stats.value}</p>
                    <p className="text-[#374151] text-sm">{stats.label}</p>
                  </div>
                ))}
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

export default TrackRecord;
