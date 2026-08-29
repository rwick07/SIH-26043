import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"

function ProblemDetails() {
  const { id } = useParams()

  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/problems/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Problem not found")
        }

        return response.json()
      })
      .then((data) => {
        setProblem(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError("Could not load this problem.")
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <Navbar />

      <main className="problem-details-page">

        <Link to="/problems">
          ← Back to Problems
        </Link>

        <h1>{problem.title}</h1>

        <div className="problem-details-card">

          <p>
            <strong>Description:</strong>
          </p>

          <p>{problem.description}</p>

          <p>
            <strong>Category:</strong> {problem.category}
          </p>

          <p>
            <strong>District:</strong> {problem.district}
          </p>

          <p>
            <strong>Location:</strong> {problem.location}
          </p>

          <p>
            <strong>Status:</strong> {problem.status}
          </p>

          {problem.photo_path && (
            <div>
              <p><strong>Evidence:</strong></p>

              <img
                src={`http://127.0.0.1:8000/${problem.photo_path}`}
                alt="Problem evidence"
                className="problem-image"
              />
            </div>
          )}

        </div>

      </main>
    </div>
  )
}

export default ProblemDetails