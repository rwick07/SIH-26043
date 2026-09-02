import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [problems, setProblems] = useState([])
  const [loadingProblems, setLoadingProblems] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      navigate("/login")
      return
    }

    setUser(JSON.parse(storedUser))
    const token = localStorage.getItem("token")

    fetch("http://127.0.0.1:8000/my-problems", {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error("Could not load problems")
            }

            return response.json()
        })
        .then((data) => {
            setProblems(data)
            setLoadingProblems(false)
        })
        .catch((error) => {
            console.error(error)
            setLoadingProblems(false)
        })
  }, [navigate])

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <Navbar />

      <main className="dashboard-page">

        <h1>Welcome, {user.name}!</h1>

        <p>
          You are logged in as a <strong>{user.role}</strong>.
        </p>

        <div className="dashboard-card">
            <h2>My Reported Problems</h2>

            {loadingProblems ? (
                <p>Loading your problems...</p>
            ) : problems.length === 0 ? (
                <p>You have not reported any problems yet.</p>
            ) : (
            <div className="my-problems-list">
            {problems.map((problem) => (
                <div className="my-problem-card" key={problem.id}>

                <h3>
                    <span
                    onClick={() => navigate(`/problems/${problem.id}`)}
                    className="problem-title-link"
                    >
                    {problem.title}
                    </span>
                </h3>

                <p>
                    <strong>Category:</strong> {problem.category}
                </p>

                <p>
                    <strong>District:</strong> {problem.district}
                </p>

                <p>
                    <strong>Status:</strong> {problem.status}
                </p>

            </div>
            ))}
        </div>
        )}
        </div>

      </main>
    </div>
  )
}

export default Dashboard