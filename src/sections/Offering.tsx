import  { useState } from 'react';
import './Offering.css';

const faqs = [
  {
    question: 'Product?',
    answer: 'You buy from NaArNi partner OEMs. Quality is ensured via stringent EV standards.',
  },
  {
    question: 'Finance?',
    answer: 'Yes, financing is available from banks and NBFCs with NaArNi\'s tie-ups.',
  },
  {
    question: 'Charging?',
    answer: 'We provide access to a wide network of fast, reliable charging stations.',
  },
  {
    question: 'Maintenance?',
    answer: 'Maintenance is covered through high-voltage AMC for the vehicle\'s lifetime.',
  },
  {
    question: 'Resale?',
    answer: 'Yes, resale is possible and supported with battery health reports.',
  },
];

const Offering = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="offering" id="Offering">
      <div className="container">
        <h2>We Design, Sell & Maintain Intercity EV Buses</h2>
        <p className="subtitle">NaArNi offers the best cost per km, reliability and availability</p>

        <div className="offer-grid">
          <div className="card">
            <h5>Bus Product</h5>
            <p>Best in class range and efficiency</p>
          </div>
          <div className="card">
            <h5>Financing</h5>
            <p>Access to long-term and cost-effective financing options</p>
          </div>
          <div className="card">
            <h5>Maintenance</h5>
            <p>Access to High-Voltage AMC throughout vehicle life</p>
          </div>
          <div className="card">
            <h5>Charging</h5>
            <p>Access to cost-effective and reliable charging options</p>
          </div>
          <div className="card">
            <h5>Battery</h5>
            <p>Battery Replacement Assurance</p>
          </div>
        </div>

        <div className="faq-section">
          <h3 className="faq-heading">Fleet Operator FAQs</h3>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <span className={`chevron ${openIndex === index ? 'rotate' : ''}`}>⌄</span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`faq-answer ${openIndex === index ? 'open' : ''}`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offering;
