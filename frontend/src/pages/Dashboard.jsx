import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function Dashboard() {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [problems, setProblems] = useState([])
    const [loadingProblems, setLoadingProblems] = useState(true)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [projectProblem, setProjectProblem] = useState(null)
    const [projectTitle, setProjectTitle] = useState("")
    const [projectDescription, setProjectDescription] = useState("")
    const [projects, setProjects] = useState([])
    const [progressProject, setProgressProject] = useState(null)
    const [newProjectProgress, setNewProjectProgress] = useState("")
    const [newProjectStatus, setNewProjectStatus] = useState("")

    const takeUpProblem = async (problemId) => {
        try {
            const response = await fetch(
            `http://127.0.0.1:8000/problems/${problemId}/take-up`,
            {
                method: "PUT",
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
            )

            const data = await response.json()

            if (!response.ok) {
            throw new Error(data.detail || "Could not take up problem")
            }

            setProblems((currentProblems) =>
            currentProblems.map((problem) =>
                problem.id === problemId
                ? {
                    ...problem,
                    university_id: user.id
                    }
                : problem
            )
            )

        } catch (error) {
            console.error(error)
            alert(error.message)
        }
        }

    const createProject = async (problemId) => {
        try {
            const response = await fetch(
            `http://127.0.0.1:8000/projects?problem_id=${problemId}&title=${encodeURIComponent(projectTitle)}&description=${encodeURIComponent(projectDescription)}`,
            {
                method: "POST",
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
            )

            const data = await response.json()

            if (!response.ok) {
            throw new Error(data.detail || "Could not create project")
            }

            alert("Project created successfully!")

            setProjectProblem(null)
            setProjectTitle("")
            setProjectDescription("")   

        } catch (error) {
            console.error(error)
            alert(error.message)
        }
        }

    const updateProjectProgress = async (projectId) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/projects/${projectId}/progress?progress=${newProjectProgress}&status=${encodeURIComponent(newProjectStatus)}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.detail || "Could not update project progress"
                )
            }

            setProjects((currentProjects) =>
                currentProjects.map((project) =>
                    project.id === projectId
                        ? {
                            ...project,
                            progress: data.progress,
                            status: data.status
                        }
                        : project
                )
            )

            setProgressProject(null)
            setNewProjectProgress("")
            setNewProjectStatus("")

        } catch (error) {
            console.error(error)
            alert(error.message)
        }
    }

    useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!storedUser || !token) {
        navigate("/login")
        return
    }

    const currentUser = JSON.parse(storedUser)
    setUser(currentUser)

    const endpoint =
        currentUser.role === "Government"
            ? "http://127.0.0.1:8000/all-problems"
            : currentUser.role === "University"
            ? "http://127.0.0.1:8000/university-problems"
            : "http://127.0.0.1:8000/my-problems"

    fetch(endpoint, {
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

    if (currentUser.role === "Government") {
        fetch("http://127.0.0.1:8000/government-projects", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Could not load projects")
                }

                return response.json()
            })
            .then((data) => {
                setProjects(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    if (currentUser.role === "University") {
        fetch("http://127.0.0.1:8000/my-projects", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Could not load projects")
                }

                return response.json()
            })
            .then((data) => {
                setProjects(data)
            })
            .catch((error) => {
                console.error(error)
            })
        }   

    }, [navigate])

    if (!user) {
    return <p>Loading...</p>
    }

    const totalProblems = problems.length

    const submittedProblems = problems.filter(
    (problem) => problem.status === "Submitted"
    ).length

    const inProgressProblems = problems.filter(
    (problem) => problem.status === "In Progress"
    ).length

    const resolvedProblems = problems.filter(
    (problem) => problem.status === "Resolved"
    ).length

    const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.description.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
        statusFilter === "All" ||
        problem.status === statusFilter

    return matchesSearch && matchesStatus
    })

    const problemList = (
    <>
        {loadingProblems ? (
        <p>Loading problems...</p>
        ) : filteredProblems.length === 0 ? (
        <p>
            {user.role === "Government"
                ? "No problems have been reported yet."
                : user.role === "University"
                    ? "No accepted problems are available yet."
                    : "You have not reported any problems yet."}
        </p>
        ) : (
        <div className="my-problems-list">

            {filteredProblems.map((problem) => (
            <div
                className="my-problem-card"
                key={problem.id}
            >

                <h3>
                <span
                    onClick={() =>
                    navigate(`/problems/${problem.id}`)
                    }
                    className="problem-title-link"
                >
                    {problem.title}
                </span>
                </h3>

                <p>
                <strong>Category:</strong>{" "}
                {problem.category}
                </p>

                <p>
                <strong>District:</strong>{" "}
                {problem.district}
                </p>

                <p>
                <strong>Status:</strong>{" "}
                {problem.status}
                </p>

                {user.role === "University" && (
                    problem.university_id === null ? (
                        <button
                            onClick={() => takeUpProblem(problem.id)}
                        >
                            Take Up Problem
                        </button>
                    ) : problem.university_id === user.id ? (
                        <>
                            <p>
                                <strong>Taken Up by Your University</strong>
                            </p>

                            {projects.some(
                                (project) => project.problem_id === problem.id
                            ) ? (
                                <p>
                                    <strong>Project Created</strong>
                                </p>
                            ) : (
                                <button
                                    onClick={() => setProjectProblem(problem.id)}
                                >
                                    Create Project
                                </button>
                            )}

                            {projectProblem === problem.id && (
                                <div className="project-form">

                                    <h4>Create Project</h4>

                                    <input
                                        type="text"
                                        placeholder="Project title"
                                        value={projectTitle}
                                        onChange={(event) =>
                                            setProjectTitle(event.target.value)
                                        }
                                    />

                                    <textarea
                                        placeholder="Describe your proposed solution..."
                                        value={projectDescription}
                                        onChange={(event) =>
                                            setProjectDescription(event.target.value)
                                        }
                                    />

                                    <button
                                        onClick={() => createProject(problem.id)}
                                        disabled={
                                            !projectTitle.trim() ||
                                            !projectDescription.trim()
                                        }
                                    >
                                        Submit Project
                                    </button>

                                    <button
                                        onClick={() => {
                                            setProjectProblem(null)
                                            setProjectTitle("")
                                            setProjectDescription("")
                                            setProjects((currentProjects) => [
                                                ...currentProjects,
                                                data
                                            ])
                                        }}
                                    >
                                        Cancel
                                    </button>

                                </div>
                            )}
                        </>
                    ) : (
                        <p>
                            <strong>Taken Up by Another University</strong>
                        </p>
                    )
                )}

            </div>
            ))}

        </div>
        )}
    </>
    )

    return (
    <div>
        <Navbar />

        <main className="dashboard-page">

        <h1>
            {user.role === "Government"
                ? "Government Dashboard"
                : user.role === "University"
                ? "University Dashboard"
                : `Welcome, ${user.name}!`}
        </h1>

        <p>
            You are logged in as <strong>{user.role}</strong>.
        </p>

        {user.role === "Government" && (
            <div className="dashboard-stats">

                <div className="stat-card">
                <h3>Total Problems</h3>
                <p>{totalProblems}</p>
                </div>

                <div className="stat-card">
                <h3>Submitted</h3>
                <p>{submittedProblems}</p>
                </div>

                <div className="stat-card">
                <h3>In Progress</h3>
                <p>{inProgressProblems}</p>
                </div>

                <div className="stat-card">
                <h3>Resolved</h3>
                <p>{resolvedProblems}</p>
                </div>

            </div>
            )}

        {user.role === "Government" && (
            <div className="dashboard-filters">

                <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                />

                <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Accepted">Accepted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                </select>

            </div>
            )}

        <div className="dashboard-card">
            <h2>
            {user.role === "Government"
                ? "All Reported Problems"
                : user.role === "University"
                ? "Accepted Problems Available for Collaboration"
                : "My Reported Problems"}
            </h2>
            {problemList}
        </div>

        {user.role === "Government" && (
            <div className="dashboard-card">
                <h2>Project Tracking</h2>

                {projects.length === 0 ? (
                    <p>No projects have been created yet.</p>
                ) : (
                    <div className="my-problems-list">
                        {projects.map((project) => (
                            <div
                                className="my-problem-card"
                                key={project.id}
                            >
                                <h3>{project.title}</h3>

                                <p>
                                    <strong>Problem:</strong>{" "}
                                    {project.problem_title}
                                </p>

                                <p>
                                    <strong>University:</strong>{" "}
                                    {project.university_name}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {project.status}
                                </p>

                                <p>
                                    <strong>Progress:</strong>{" "}
                                    {project.progress}%
                                </p>

                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${project.progress}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {user.role === "University" && (
            <div className="dashboard-card">
                <h2>My Projects</h2>

                {projects.length === 0 ? (
                    <p>You have not created any projects yet.</p>
                ) : (
                    <div className="my-problems-list">
                        {projects.map((project) => (
                            <div
                                className="my-problem-card"
                                key={project.id}
                            >
                                <h3>{project.title}</h3>

                                <p>
                                    <strong>Description:</strong>{" "}
                                    {project.description}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {project.status}
                                </p>

                                <p>
                                    <strong>Progress:</strong>{" "}
                                    {project.progress}%
                                </p>

                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${project.progress}%`
                                        }}
                                    >
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setProgressProject(project.id)
                                        setNewProjectProgress(project.progress.toString())
                                        setNewProjectStatus(project.status)
                                    }}
                                >
                                    Update Progress
                                </button>

                                {progressProject === project.id && (
                                    <div className="project-form">

                                        <h4>Update Project Progress</h4>

                                        <label>
                                            Status
                                        </label>

                                        <select
                                            value={newProjectStatus}
                                            onChange={(event) =>
                                                setNewProjectStatus(event.target.value)
                                            }
                                        >
                                            <option value="Proposed">Proposed</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>

                                        <label>
                                            Progress (%)
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={newProjectProgress}
                                            onChange={(event) =>
                                                setNewProjectProgress(event.target.value)
                                            }
                                        />

                                        <button
                                            onClick={() =>
                                                updateProjectProgress(project.id)
                                            }
                                            disabled={
                                                newProjectProgress === "" ||
                                                Number(newProjectProgress) < 0 ||
                                                Number(newProjectProgress) > 100
                                            }
                                        >
                                            Save Progress
                                        </button>

                                        <button
                                            onClick={() => {
                                                setProgressProject(null)
                                                setNewProjectProgress("")
                                                setNewProjectStatus("")
                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        </main>
    </div>
    )
}

export default Dashboard