import './TrackRecord.css';

const TrackRecord = () => (
  <section className="track-record" id="TrackRecord">
    <div className="container">
      <h2>Our Track Record in EV Buses</h2>
      <div className="timeline">
        <div className="item">
          <h4>2015–2021 – Mozev</h4>
          <p>India's First Intercity EV Bus OEM</p>
          <ul>
            <li>25 buses with BYD</li>
            <li>Pipeline of 150 buses</li>
          </ul>
        </div>
        <div className="item">
          <h4>2021–Now – Greencell acquires Mozev</h4>
          <ul>
            <li>300+ NueGo Buses connecting 100+ cities</li>
            <li>Over 100 million km run with 500 km+ per day</li>
            <li>Largest intercity EV bus operator in India</li>
          </ul>
        </div>
        <div className="item">
          <h4>2024 – NaArNi journey begins</h4>
          <p>Entry with Intercity Buses (350,000+)</p>
          <p><strong>Trucks Coming Soon.</strong></p>
        </div>
      </div>
    </div>
  </section>
);

export default TrackRecord;
