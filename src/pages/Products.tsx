import React from "react";
import Lottie from "react-lottie-player";
import StaticSEO from "../seo/StaticSEO";
import { InView } from "react-intersection-observer";
import EVBus from "../assets/lotties/ev-bus.json";
import ComingSoon from "../assets/lotties/loading.json";
import Bus from "../assets/products/bus.jpg";
import Footer from "../components/Footer";

const cardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const Products: React.FC = () => {
  const buses = [
    {
      name: "NaArNi Intercity Electric Bus",
      type: "Heavy Commercial Vehicle (HCV)",
      range: "100+ km per charge",
      charge: "Fast Charging in 1.5 hrs",
      img: Bus,
    },
  ];

//   const [offsetY, setOffsetY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => setOffsetY(window.pageYOffset);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

  return (
    <>
      <StaticSEO path="/products" />
      <div className="bg-[#F9F7F7] pt-16 text-[#111827]">
      {/* Hero */}
      <InView triggerOnce threshold={0.4}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20`}
          >
            <div className="md:w-1/2 text-center md:text-left p-6 rounded" style={cardStyle}>
              <h1 className="text-5xl md:text-6xl font-bold text-[#1E40AF] leading-snug">
                Heavy EVs Engineered for{" "}
                <span className="bg-[#3B82F6] text-white px-3 rounded-lg">Operators</span>
              </h1>
              <p className="mt-4 text-[#374151] max-w-md">
                We manufacture <strong>best-in-class intercity electric buses</strong> trusted by India’s largest fleet operators. Designed for{" "}
                <strong>profitability, reliability, and lowest cost per km</strong>.
              </p>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <Lottie loop play animationData={EVBus} className="w-80 md:w-[450px]" />
            </div>
          </section>
        )}
      </InView>

      {/* Products */}
      <InView triggerOnce threshold={0.1}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } py-16 bg-[#CBD5E1]/30`}
          >
            <h2 className="text-4xl font-bold text-center text-[#1E40AF]">Our Products</h2>
            <p className="text-center text-[#374151] mt-2">
              Built for long hauls, trusted by operators nationwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-10 px-4">
              {buses.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl shadow hover:shadow-lg hover:scale-105 transition overflow-hidden bg-white"
                >
                  <img src={item.img} alt={item.name} className="w-full h-56 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#1E40AF]">{item.name}</h3>
                    <p className="text-[#6B7280] text-sm">{item.type}</p>
                    <div className="mt-3 space-y-1 text-sm text-[#374151]">
                      <p>🔋 Range: {item.range}</p>
                      <p>⚡ Charging: {item.charge}</p>
                    </div>
                    <a
                      href="/contact"
                      className="mt-4 inline-block bg-[#3B82F6] text-white px-4 py-2 rounded-lg shadow hover:bg-[#1E40AF] transition"
                    >
                      Request for Fleet Orders
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </InView>

      {/* Coming Soon */}
      <InView triggerOnce threshold={0.1}>
        {({ inView, ref }) => (
          <section
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } py-16 bg-[#CBD5E1]/30 text-center`}
          >
            <h2 className="text-4xl font-bold text-[#1E40AF]">What's Next?</h2>
            <p className="text-[#374151] mt-2">
              Electric <strong>Trucks</strong> launching soon to revolutionize logistics.
            </p>
            <div className="mt-6 flex justify-center">
              <Lottie loop play animationData={ComingSoon} className="w-64 md:w-80" />
            </div>
          </section>
        )}
      </InView>

      <Footer />
      </div>
    </>
  );
};

export default Products;
