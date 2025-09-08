import React from "react";
import { InView } from "react-intersection-observer";
import { Battery, PlugZap, Truck, Wallet, Wrench, DollarSign } from "lucide-react";
import Footer from "../components/Footer";
import StaticSEO from "../seo/StaticSEO";

// import { MdEco } from 'react-icons/md';
// import { FaBatteryFull } from 'react-icons/fa';
// import { FaDesktop } from 'react-icons/fa';
import { Link } from "react-router-dom";

// const parallaxImages = [
//   "/images/road1.jpg",
//   "/images/bus.jpg",
// ];

const Home: React.FC = () => {

    const vision2030 = [
      {
        title: "EV as Default Choice",
        desc: "Fleet operators choose EVs as their primary heavy vehicle option.",
      },
      {
        title: "Trusted Brand & Ecosystem Leader",
        desc: "NaArNi becomes the most trusted brand for fleet operators and the broader EV ecosystem.",
      },
      {
        title: "20% Market Share in HCVs",
        desc: "NaArNi to become a trusted leader in heavy commercial EVs.",
      },
      // {
      //   title: "Best Value & Reliability",
      //   desc: "NaArNi synonymous with reliability and lowest cost per km.",
      // },
    ];
  
  // const [offsetY, setOffsetY] = useState(0);

  // useEffect(() => {
  //   const handleScroll = () => setOffsetY(window.pageYOffset);
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // const getParallaxStyle = (index: number) => {
  //   if (index % 2 === 0) {
  //     return {
  //       backgroundImage: `url(${parallaxImages[index / 2] || parallaxImages[0]})`,
  //       backgroundAttachment: "fixed",
  //       backgroundPosition: `center ${-offsetY * 0.3}px`,
  //       backgroundRepeat: "no-repeat",
  //       backgroundSize: "cover",
  //       position: "relative" as const,
  //     };
  //   }
  //   return {};
  // };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  //   const palette = {
  //   background: "#F9F7F7",
  //   secondary: "#DBE2EF",
  //   primary: "#3F72AF",
  //   dark: "#112D4E",
  // };

  return (
    <>
      <StaticSEO path="/" />
      <div className="text-[#111827] bg-[#F9F7F7]">
        {/* Hero Section */}
      <InView triggerOnce threshold={0.2}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 w-full`}
          >
            <div
              className="w-full  text-center md:text-left p-6 rounded mt-9"
              style={cardStyle}
            >
              {/* <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-snug text-[#1E3A8A]">
                Empowering the Future of{" "}
                <span className="px-3 rounded bg-[#3B82F6] text-white">Heavy EVs</span>
              </h1> */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-snug text-[#1E3A8A]">
                Electrifying Heavy Commercial Vehicles
                {/* <span className="px-3 rounded bg-[#3B82F6] text-white">Heavy Commercial Vehicles</span> */}
              </h1>
              
              
              
              {/* <p className="mt-4 max-w-full md:max-w-md text-[#374151] mx-auto md:mx-0">
                Best‑in‑class products, smart financing, reliable charging, and battery assurance – all in one ecosystem.
              </p> */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-center">
                {/* <a
                  href="/products"
                  className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow transition text-center"
                >
                  Explore Products
                </a> */}
                <Link
                  to="/contact"
                  className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow transition text-center justify-center">
                    Get Started
                </Link>
              </div>
            </div>
            {/* <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <img
                src="/images/ev-bus.jpg"
                alt="Electric Bus"
                className="max-w-full h-auto object-contain"
              />
            </div> */}
          </section>
        )}
      </InView>

      {/* Ecosystem Section - Tabbed Card Layout */}
      {/* <section className="py-16 bg-[#CBD5E1]/30">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF]">
                The NaArNi Ecosystem
              </h2>
              <p className="text-center mt-2 text-[#111827] max-w-lg mx-auto px-4">
                Everything fleet operators need to confidently go electric.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto mt-10 px-4">
                {[
                  {
                    name: "Product",
                    icon: <Truck className="w-10 h-10" />,
                    question: "Who do I buy from? What about quality?",
                    answer: "Best-in-class range & efficiency with proven reliability.",
                  },
                  {
                    name: "Financing",
                    icon: <Wallet className="w-10 h-10" />,
                    question: "Will I be able to get financing and from whom?",
                    answer: "Access to long-term, cost-effective leasing and loan options.",
                  },
                  {
                    name: "Charging",
                    icon: <PlugZap className="w-10 h-10" />,
                    question: "Where do I find reliable and fast charging?",
                    answer: "Seamless access to fast, cost-effective charging infrastructure.",
                  },
                  {
                    name: "Maintenance",
                    icon: <Wrench className="w-10 h-10" />,
                    question: "Who will maintain the electrical components?",
                    answer: "High-voltage AMC & expert service throughout vehicle life.",
                  },
                  {
                    name: "Resale / Battery",
                    icon: <Battery className="w-10 h-10" />,
                    question: "Can I resell and at what price?",
                    answer: "Battery replacement assurance & strong resale support.",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl p-6 shadow hover:shadow-lg transition hover:scale-105 bg-white flex flex-col"
                  >
                    <div className="flex justify-center text-[#1E40AF] mb-4">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-[#1E40AF] text-center mb-2">{item.name}</h3>
                    <div className="text-sm text-[#111827]">
                      <p className="italic font-medium">“{item.question}”</p>
                      <p className="mt-2">{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section> */}

      {/* Fleet Operators' Concerns */}
      <section className="py-20 bg-[#fff]/30">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } max-w-5xl mx-auto px-6`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E3A8A]">
                Fleet Operators Can Make More Money with EVs,
              </h2>
              <p className="text-center text-lg mt-2 mb-10">
                But they still have many questions...
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Product",
                    icon: <Truck className="w-10 h-10" />,
                    question: "Who do I buy from? What about quality?",
                  },
                  {
                    title: "Finance",
                    icon: <Wallet className="w-10 h-10" />,
                    question: "Will I be able to get financing and from whom?",
                  },
                  {
                    title: "Charging",
                    icon: <PlugZap className="w-10 h-10" />,
                    question: "Where do I find reliable and fast charging?",
                  },
                  {
                    title: "Maintenance",
                    icon: <Wrench className="w-10 h-10" />,
                    question: "Who will maintain the electrical components?",
                  },
                  {
                    title: "Resale",
                    icon: <DollarSign className="w-10 h-10" />,
                    question: "Can I resell and at what price?",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-white border border-[#fff] rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 ease-out flex flex-col items-center text-center relative group before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-blue-500/20 before:via-purple-500/20 before:to-blue-500/20 before:opacity-0 before:transition-opacity before:duration-500 before:group-hover:opacity-100 before:-z-10 after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-blue-400/10 after:via-purple-400/10 after:to-blue-400/10 after:opacity-0 after:transition-opacity after:duration-500 after:group-hover:opacity-100 after:-z-20"
                  >
                    <div className="text-[#1E40AF] mb-4">{item.icon}</div>
                    <h3 className="text-xl font-semibold text-[#1E40AF] mb-2">{item.title}</h3>
                    <p className="text-[#374151] italic font-medium">“{item.question}”</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section>

      {/*  NaArNi Ecosystem Solutions */}
      <section className="py-20 bg-[#fff]/30">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF]">
                We Enable HCV Fleet Operators to Move to Electric
              </h2>
              <p className="text-center mt-2 text-[#111827] max-w-xl mx-auto px-4">
                NaArNi offers best cost per km, reliability and availability.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto mt-12 px-4">
                {[
                  {
                    name: "Product",
                    answer: "Best-in-class range & efficiency with proven reliability.",
                    imageAlt: "/images/Bus.png",
                  },
                  {
                    name: "Financing",
                    answer: "Access to long-term and cost-effective financing options.",
                    imageAlt: "/images/finance.png",
                  },
                  {
                    name: "Maintenance",
                    answer: "Access to High-Voltage AMC through vehicle life.",
                    imageAlt: "/images/maintenance.png",
                  },
                  {
                    name: "Charging",
                    answer: "Access to cost-effective and reliable charging options.",
                    imageAlt: "/images/charging.png",
                  },
                  {
                    name: "Battery",
                    icon: <Battery className="w-10 h-10" />,
                    answer: "Battery Replacement Assurance.",
                    imageAlt: "/images/battery.png",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-6 shadow hover:shadow-xl hover:scale-105 bg-white transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <img src={item.imageAlt}  alt={item.name} className="text-xs text-gray-400 mt-3 italic rounded-full object-cover"></img>
                    {/* <div className="text-[#1E40AF] mb-4">{item.icon}</div> */}
                    <h3 className="text-lg font-semibold text-[#1E40AF] mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#111827]">{item.answer}</p>
                    </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section>


      {/* Why Choose Section */}
      {/* <section className="pt-5 bg-[#CBD5E1]/30">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } max-w-6xl mx-auto px-4 pb-10`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF]">
                Why Choose <span className="bg-[#3B82F6] text-white px-2 rounded">NaArNi?</span>
              </h2>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "120+ km Range",
                    icon: <MdEco className="w-14 h-14" color="#1E40AF" />,
                    text: "Heavy EVs optimized for long hauls.",
                  },
                  {
                    title: "70% CO2 Reduction",
                    icon: <FaBatteryFull className="w-14 h-14" color="#1E40AF" />,
                    text: "Cleaner, greener, future‑ready mobility.",
                  },
                  {
                    title: "Smart IoT Monitoring",
                    icon: <FaDesktop className="w-14 h-14" color="#1E40AF" />,
                    text: "Track and manage fleets in real time.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="relative group cursor-pointer overflow-hidden rounded-xl p-6 shadow hover:shadow-lg bg-white transition"
                  >
                    <div className="relative z-10 flex flex-col items-center text-center group-hover:text-[#1E40AF]">
                      {item.icon}
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="mt-2 max-w-xs">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </InView>
      </section>
 */}

      {/* Vision 2030 */}
      <section className="py-16 bg-[#CBD5E1]/30">
        <InView triggerOnce threshold={0.1}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              className={`transition-all duration-1000 ease-out transform ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } max-w-6xl mx-auto px-4`}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF]">
                NaArNi Vision 2030
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
                {vision2030.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-6 text-center shadow hover:shadow-lg hover:scale-105 transition bg-white"
                  >
                    <h3 className="text-xl font-semibold text-[#1E40AF]">{item.title}</h3>
                    <p className="text-[#111827] text-sm mt-2">{item.desc}</p>
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

export default Home;
