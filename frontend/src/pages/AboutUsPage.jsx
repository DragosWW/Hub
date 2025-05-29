
import React from 'react';
import './AboutUsPage.css'; 



function AboutUsPage() {
  return (
    <> 
      
      <section className="hero about-us-hero"> 
        <div className="container">
          <h2>Despre Cultural Hub Brașov</h2>
          <p>Descoperiți povestea noastră și pasiunea pentru promovarea evenimentelor din Brașov.</p>
        </div>
      </section>

      
      <main className="about-us-main-content">
        <section className="despre-noi">
          <div className="container">
            <div className="section-content">
              <h3>Misiunea noastră</h3>
              <p>Suntem o echipă pasionată de orașul Brașov și de bogăția evenimentelor culturale, artistice și sportive care au loc aici. Ne-am propus să creăm o platformă care să aducă împreună toate aceste evenimente într-un singur loc, făcându-le accesibile atât pentru localnici, cât și pentru turiști.</p>
              
              <h3>Viziunea noastră</h3>
              <p>Ne dorim ca Brașovul să fie recunoscut ca unul dintre cele mai vibrante orașe din România din punct de vedere al vieții culturale și sociale. Prin intermediul platformei noastre, contribuim la creșterea vizibilității evenimentelor locale și la dezvoltarea unei comunități active și implicate.</p>
              
              <h3>Ce oferim</h3>
              <ul>
                <li>Informații actualizate despre toate evenimentele din Brașov</li>
                <li>Calendar complet al evenimentelor pentru planificare ușoară</li>
                <li>Recenzii și recomandări pentru cele mai interesante evenimente</li>
                <li>Interviuri cu organizatori și artiști locali</li>
                <li>Posibilitatea de a achiziționa bilete direct de pe platforma noastră (funcționalitate viitoare)</li>
              </ul>
            </div>
            
            <div className="team-section">
              <h3>Echipa noastră</h3>
              <div className="team-members">
                <div className="member">
                  
                  <div className="member-avatar-placeholder">OD</div>
                  <h4>Oancea Dragos</h4>
                  <p>Student</p>
                </div>
                <div className="member">
                  <div className="member-avatar-placeholder">PD</div>
                  <h4>Popa Dragos</h4>
                  <p>Student</p>
                </div>
                <div className="member">
                  <div className="member-avatar-placeholder">LV</div>
                  <h4>Lazar Valentin</h4>
                  <p>Student</p>
                </div>
                <div className="member">
                  <div className="member-avatar-placeholder">TR</div>
                  <h4>Timofta Rares</h4>
                  <p>Student</p>
                </div>
              </div>
            </div>
            
            <div className="values-section">
              <h3>Valorile noastre</h3>
              <div className="values-grid">
                <div className="value">
                  <h4>Transparență</h4>
                  <p>Informații corecte și verificate despre toate evenimentele promovate.</p>
                </div>
                <div className="value">
                  <h4>Comunitate</h4>
                  <p>Sprijinirea și promovarea inițiativelor locale cu impact pozitiv.</p>
                </div>
                <div className="value">
                  <h4>Diversitate</h4>
                  <p>Susținerea unei game largi de evenimente pentru toate gusturile și vârstele.</p>
                </div>
                <div className="value">
                  <h4>Inovație</h4>
                  <p>Utilizarea tehnologiei pentru a facilita accesul la evenimente culturale.</p>
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>
    </>
  );
}

export default AboutUsPage;