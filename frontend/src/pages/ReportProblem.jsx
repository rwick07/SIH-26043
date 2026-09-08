import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function ReportProblem() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [district, setDistrict] = useState("")
  const [location, setLocation] = useState("")
  const [message, setMessage] = useState("")
  const [file, setFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
      const token = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (!token || !storedUser) {
          navigate("/login")
          return
      }

      const currentUser = JSON.parse(storedUser)

      if (currentUser.role !== "Citizen") {
          navigate("/dashboard")
      }
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    const formData = new FormData()

    formData.append("title", title)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("district", district)
    formData.append("location", location)

    if (file) {
      formData.append("file", file)
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/problems", {
        method: "POST",
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
          setMessage(`Problem submitted successfully! ID: ${data.problem_id}`)

          setTitle("")
          setDescription("")
          setCategory("")
          setDistrict("")
          setLocation("")
          setFile(null)

          setTimeout(() => {
              navigate("/dashboard")
          }, 1200)
      } else {
          setMessage("Failed to submit problem.")
          setIsSubmitting(false)
      }

    } catch (error) {
      console.error(error)
      setMessage("Could not connect to the server.")
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Navbar />

      <main className="report-page">
        <h1>Report a Community Problem</h1>

        <p>
          Help identify challenges in your community so they can
          be evaluated and developed into solutions.
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Problem title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Road becomes flooded during monsoon"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the problem in detail..."
              rows="5"
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Select a category</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="agriculture">Agriculture</option>
              <option value="water">Water Management</option>
              <option value="sanitation">Sanitation</option>
              <option value="environment">Environment</option>
              <option value="infrastructure">Urban Infrastructure</option>
              <option value="accessibility">Accessibility</option>
              <option value="rural-livelihoods">Rural Livelihoods</option>
            </select>
          </label>

          <label>
            District
            <select
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
            >
              <option value="">Select district</option>
              <option value="Ranchi">Ranchi</option>
              <option value="East Singhbhum">East Singhbhum</option>
              <option value="Dhanbad">Dhanbad</option>
              <option value="Bokaro">Bokaro</option>
              <option value="Deoghar">Deoghar</option>
              <option value="Hazaribagh">Hazaribagh</option>
            </select>
          </label>

          <label>
            Location
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Enter location"
            />
          </label>

          <label>
            Photo
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files[0])}
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Analyzing your problem with AI..." : "Submit Problem"}
          </button>

          {message && <p>{message}</p>}

        </form>
      </main>
    </div>
  )
}

export default ReportProblem