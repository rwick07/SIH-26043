import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Navbar />

      <main className="home-page">

        <section className="hero-section">
          <h1>Turn Community Problems Into Real Solutions</h1>

          <p>
            Connect societal challenges with universities, students,
            researchers and industry partners.
          </p>

          <div className="hero-buttons">
            {user?.role === "Citizen" && (
              <button onClick={() => navigate("/report")}>
                Report a Problem
              </button>
            )}

            <button onClick={() => navigate("/problems")}>
              Explore Problems
            </button>
          </div>
        </section>


        <section className="features-section">

          <div className="feature-card">
            <h2>Report</h2>
            <p>
              Citizens can report real-world problems with descriptions,
              locations and photos.
            </p>
          </div>

          <div className="feature-card">
            <h2>Collaborate</h2>
            <p>
              Universities, students and industry partners can work
              together to solve challenges.
            </p>
          </div>

          <div className="feature-card">
            <h2>Build Solutions</h2>
            <p>
              Turn identified problems into meaningful projects and
              practical solutions.
            </p>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Home;