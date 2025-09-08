import React from "react";
import Lottie from "react-lottie-player";
import StaticSEO from "../seo/StaticSEO";
import { InView } from "react-intersection-observer";
import CareersTeam from "../assets/lotties/careers-team.json";
import WorkSpace from "../assets/lotties/workspace.json";
import Growth from "../assets/lotties/growth-success.json";
import Footer from "../components/Footer";

const cardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  border: "1px solid rgba(255,255,255,0.15)",
};

const Careers: React.FC = () => {
  const whyWork = [
    {
      title: "Impactful Work",
      desc: "Drive the EV revolution & make mobility greener.",
      anim: WorkSpace,
    },
    {
      title: "Innovative Culture",
      desc: "Work with cutting-edge EV and IoT technologies.",
      anim: Growth,
    },
    {
      title: "Growth Opportunities",
      desc: "Upskill and grow in the fastest-growing EV industry.",
      anim: WorkSpace,
    },
  ];

  //   const jobs = [
  //   {
  //     role: "Founder Staff",
  //     location: "Bengaluru, India",
  //     exp: "3-4 yrs workex",
  //   },
  //   {
  //     role: "Data Analyst",
  //     location: "Bengaluru, India",
  //     exp: "3-4 yrs workex",
  //   },
  //   {
  //     role: "Aftersales Manager",
  //     location: "Bengaluru, India",
  //     exp: "10-15 yrs workex",
  //   },
  //   {
  //     role: "HR and Admin",
  //     location: "Bengaluru, India",
  //     exp: "3-4 yrs workex",
  //   },
  // ];

  return (
    <>
      <StaticSEO path="/careers" />
      <div className="bg-[#F9F7F7] pt-16 text-[#1F2937]">
      {/* Hero Section */}
      <InView triggerOnce threshold={0.2}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 transition-all duration-1000 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-full md:w-1/2 text-center md:text-left p-4 sm:p-6" style={cardStyle}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E40AF] leading-snug">
                Join{" "}
                <span className="bg-[#3B82F6]/90 text-white px-3 rounded-lg">
                  Our Team
                </span>
              </h1>
              <p className="mt-4 text-[#374151] text-base sm:text-lg max-w-md mx-auto md:mx-0">
                Be part of the EV revolution. Work with innovators building the future of sustainable transportation.
              </p>
            </div>
            <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <Lottie loop={false} play={false} animationData={CareersTeam} className="w-64 sm:w-72 md:w-[450px]" />
            </div>
          </section>
        )}
      </InView>

      {/* Why Work */}
      <InView triggerOnce threshold={0.2}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`py-12 sm:py-16 bg-[#E2E8F0]/50 transition-all duration-1000 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF]">
              Why Work at NaArNi?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mt-10 px-4">
              {whyWork.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-6 text-center shadow hover:shadow-lg hover:scale-105 transition bg-white"
                >
                  <Lottie loop={false} play animationData={item.anim} className="w-20 h-20 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-[#3B82F6]">{item.title}</h3>
                  <p className="text-[#374151] text-sm sm:text-base mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </InView>

      
       {/* Open Positions */}
       {/* <InView triggerOnce threshold={0.2}>
//         {({ inView, ref }) => (
//           <section
//             ref={ref}
//             className={`py-16 bg-[#F1F5F9] transition-all duration-1000 ease-out transform ${
//               inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//             }`}
//           >
//             <h2 className="text-4xl font-bold text-center text-[#1E40AF]">
//               Open Positions
//             </h2>
//             <div className="max-w-5xl mx-auto mt-10 space-y-6 px-4">
//               {jobs.map((job, i) => (
//                 <div
//                   key={i}
//                   className="flex flex-col md:flex-row items-center justify-between rounded-xl p-6 shadow hover:shadow-lg bg-white transition"
//                 >
//                   <div>
//                     <h3 className="text-xl font-bold text-[#3B82F6]">{job.role}</h3>
//                     <p className="text-[#4B5563] text-sm font-medium">
//                       {job.location} · {job.exp}
//                     </p>
//                   </div>
//                   <a
//                     href="mailto:website@naarni.com"
//                     className="mt-4 md:mt-0 bg-[#B8F306] text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-[#A7DC06] transition"
//                   >
//                     Apply Now
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}
//       </InView> */}


      

      <Footer />
      </div>
    </>
  );
};

export default Careers;
