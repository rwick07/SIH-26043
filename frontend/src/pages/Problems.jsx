import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

function Problems() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [district, setDistrict] = useState("")

  const formatOption = (value) => {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  useEffect(() => {
    fetch("http://127.0.0.1:8000/problems")
      .then((response) => response.json())
      .then((data) => {
        setProblems(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching problems:", error)
        setLoading(false)
      })
  }, [])

  const categories = [
    ...new Set(
      problems.map((problem) => problem.category.toLowerCase())
    )
  ]

  const districts = [
    ...new Set(
      problems.map((problem) => problem.district.toLowerCase())
    )
  ]

  const filteredProblems = problems.filter((problem) => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      problem.title.toLowerCase().includes(searchText) ||
      problem.description.toLowerCase().includes(searchText) ||
      problem.location.toLowerCase().includes(searchText)

    const matchesCategory =
      category === "" ||
      problem.category.toLowerCase() === category

    const matchesDistrict =
      district === "" ||
      problem.district.toLowerCase() === district

    return matchesSearch && matchesCategory && matchesDistrict
  })

  return (
    <div>
      <Navbar />

      <main className="problems-page">

        <h1>Community Problems</h1>

        <div className="problem-filters">

          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {formatOption(item)}
              </option>
            ))}
          </select>

          <select
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
          >
            <option value="">All districts</option>

            {districts.map((item) => (
              <option key={item} value={item}>
                {formatOption(item)}
              </option>
            ))}
          </select>

        </div>

        <div className="problem-stats">

          <div className="stat-card">
            <h3>Total Problems</h3>
            <p>{problems.length}</p>
          </div>

          <div className="stat-card">
            <h3>Showing</h3>
            <p>{filteredProblems.length}</p>
          </div>

        </div>

        {loading ? (
          <p>Loading problems...</p>
        ) : filteredProblems.length === 0 ? (
          <p>No matching problems found.</p>
        ) : (
          <div className="problems-list">

            {filteredProblems.map((problem) => (

              <div
                className="problem-card"
                key={problem.id}
              >

                <Link to={`/problems/${problem.id}`}>
                  <h2>{problem.title}</h2>
                </Link>

                <p>{problem.description}</p>

                <div className="problem-details">

                  <span>{problem.category}</span>

                  <span>{problem.district}</span>

                  <span>{problem.status}</span>

                </div>

                <p>
                  <strong>Location:</strong>{" "}
                  {problem.location}
                </p>

              </div>

            ))}

          </div>
        )}

      </main>
    </div>
  )
}

export default Problems