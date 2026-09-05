import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"

function ProblemDetails() {
  const { id } = useParams()

  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [user, setUser] = useState(null)

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

  useEffect(() => {
  const storedUser = localStorage.getItem("user")

  if (storedUser) {
    setUser(JSON.parse(storedUser))
  }
}, [])

  const updateStatus = () => {
  fetch(
    `http://127.0.0.1:8000/problems/${id}/status?status=${encodeURIComponent(newStatus)}`,
    {
      method: "PUT",
      headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not update status")
      }

      return response.json()
    })
    .then((data) => {
      setProblem({
        ...problem,
        status: data.status,
      })

      setStatusMessage("Status updated successfully.")
    })
    .catch((error) => {
      console.error(error)
      setStatusMessage("Could not update status.")
    })
  }

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

          <div className="status-section">
            <p>
              <strong>Current Status:</strong> {problem.status}
            </p>

            {user?.role === "Government" && (
              <>
                <select
                  value={newStatus}
                  onChange={(event) => setNewStatus(event.target.value)}
                >
                  <option value="">Select new status</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <button
                  onClick={updateStatus}
                  disabled={!newStatus}
                >
                  Update Status
                </button>

                {statusMessage && (
                  <p>{statusMessage}</p>
                )}
              </>
            )}
          </div>

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