import { useState } from "react"
import Navbar from "../components/Navbar"

function ReportProblem() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [district, setDistrict] = useState("")
  const [location, setLocation] = useState("")

  function handleSubmit(event) {
    event.preventDefault()

    console.log({
      title,
      description,
      category,
      district,
      location
    })
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
              <option value="ranchi">Ranchi</option>
              <option value="jamshedpur">East Singhbhum</option>
              <option value="dhanbad">Dhanbad</option>
              <option value="bokaro">Bokaro</option>
              <option value="deoghar">Deoghar</option>
              <option value="hazaribagh">Hazaribagh</option>
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
            <input type="file" accept="image/*" />
          </label>

          <button type="submit">
            Submit Problem
          </button>

        </form>
      </main>
    </div>
  )
}

export default ReportProblem