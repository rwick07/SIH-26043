import { useEffect, useState } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"

function ProblemDetails() {
  const { id } = useParams()
  const location = useLocation()

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

        <Link
          to={
            location.state?.from === "dashboard"
              ? "/dashboard"
              : "/problems"
          }
        >
          ← Back
        </Link>

        <h1>{problem.title}</h1>

        {/* Original Problem */}
        <div className="problem-details-card">

          <h2>Problem Information</h2>

          <p>
            <strong>Description:</strong>
          </p>

          <p>{problem.description}</p>

          <div className="problem-info-grid">

            <p>
              <strong>Category:</strong><br />
              {problem.category}
            </p>

            <p>
              <strong>District:</strong><br />
              {problem.district}
            </p>

            <p>
              <strong>Location:</strong><br />
              {problem.location}
            </p>

            <p>
              <strong>Submitted Status:</strong><br />
              {problem.status}
            </p>

          </div>

          {/* Evidence */}
          {problem.photo_path && (
            <div className="evidence-section">
              <p>
                <strong>Evidence:</strong>
              </p>

              <img
                src={`http://127.0.0.1:8000/${encodeURI(problem.photo_path)}`}
                alt="Problem evidence"
                className="problem-image"
              />
            </div>
          )}

        </div>


        {/* AI Analysis */}
        <div className="ai-analysis-card">

          <div className="ai-analysis-header">
            <div>
              <h2>AI Problem Analysis</h2>
              <p>
                JanSetu automatically analyzed this report to help
                authorities prioritize and understand the problem.
              </p>
            </div>

            <span className="ai-badge">
              AI Powered
            </span>
          </div>


          <div className="ai-insights-grid">

            <div className="ai-insight">
              <span className="ai-label">AI Category</span>
              <strong>
                {problem.ai_category || "Not available"}
              </strong>
            </div>

            <div className="ai-insight">
              <span className="ai-label">Priority</span>
              <strong className={`priority-${problem.ai_priority}`}>
                {problem.ai_priority
                  ? problem.ai_priority.toUpperCase()
                  : "Not available"}
              </strong>
            </div>

          </div>


          <div className="ai-section">

            <h3>AI Summary</h3>

            <p>
              {problem.ai_summary || "AI summary not available."}
            </p>

          </div>


          <div className="ai-section">

            <h3>Keywords</h3>

            <div className="keyword-list">

              {problem.ai_keywords
                ? problem.ai_keywords
                    .split(",")
                    .map((keyword, index) => (
                      <span
                        className="keyword-tag"
                        key={index}
                      >
                        {keyword.trim()}
                      </span>
                    ))
                : (
                  <span>No keywords available.</span>
                )}

            </div>

          </div>


          <div className="ai-section">

            <h3>Suggested Solution</h3>

            <p>
              {problem.ai_solution ||
                "AI solution is not available yet."}
            </p>

          </div>


          <div className="ai-section">

            <h3>Pattern Insight</h3>

            <p>
              {problem.ai_pattern_note ||
                "No pattern insight available yet."}
            </p>

          </div>

        </div>


        {/* Government Status Control */}
        <div className="problem-details-card status-section">

          <h2>Problem Status</h2>

          <p>
            <strong>Current Status:</strong>{" "}
            {problem.status}
          </p>

          {user?.role === "Government" && (
            <>
              <select
                value={newStatus}
                onChange={(event) =>
                  setNewStatus(event.target.value)
                }
              >
                <option value="">
                  Select new status
                </option>

                <option value="Submitted">
                  Submitted
                </option>

                <option value="Under Review">
                  Under Review
                </option>

                <option value="Accepted">
                  Accepted
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

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

      </main>
    </div>
  )
}

export default ProblemDetails