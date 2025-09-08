import './Team.css';

const Team = () => {
  return (
    <section className="team" id="Team">
      <div className="container">
        <h2>Meet the Team</h2>
        <p className="subtitle">Founders are Second Time Entrepreneurs in the Electric Vehicle Space</p>
        <div className="team-grid">
          <div className="founder-card">
            <h4>Ankit Singhvi</h4>
            <span className="role">CEO, NaArNi</span>
            <p>IIT-Bombay, MBA - Harvard<br/>ITC, McKinsey<br/>Ex-CEO, Mozev, Exit to Greencell</p>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <div className="founder-card">
            <h4>Anand Ayyadurai</h4>
            <span className="role">CEO, NaArNi</span>
            <p>IIM - Ahmedabad<br/>Flipkart<br/>Ex - CEO - Vogo, Exit to Chalo</p>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className='stats'>
        <h3 className="stats-title">HCVs* are a $2 Tn Opportunity</h3>
        <div className="stats-grid">
          <div><strong>5MN</strong><br/>Vehicles in India are HCV</div>
          <div><strong>1MN</strong><br/>Fleet Operators</div>
          <div><strong>40%</strong><br/>Diesel Consumption</div>
          <div><strong>80%</strong><br/>Running Cost</div>
        </div>
        <p className="note">*HCV = Buses & Heavy Trucks</p>
        </div>
      </div>
    </section>
  );
};

export default Team;
