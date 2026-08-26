import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function Home() {
    const navigate = useNavigate()
  return (
    <div>
      <Navbar />

      <main>
        <h1>Turn Community Problems Into Real Solutions</h1>

        <p>
          Connect societal challenges with universities,
          students, researchers and industry partners.
        </p>

        <button onClick={() => navigate("/report")}>
          Report a Problem
        </button>
      </main>
    </div>
  )
}

export default Home