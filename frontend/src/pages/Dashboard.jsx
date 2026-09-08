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
    const [projectSearch, setProjectSearch] = useState("")
    const [projectProblem, setProjectProblem] = useState(null)
    const [projectTitle, setProjectTitle] = useState("")
    const [projectDescription, setProjectDescription] = useState("")
    const [projects, setProjects] = useState([])
    const [progressProject, setProgressProject] = useState(null)
    const [newProjectProgress, setNewProjectProgress] = useState("")
    const [newProjectStatus, setNewProjectStatus] = useState("")
    const [milestoneMessage, setMilestoneMessage] = useState("")

    const updateProblemStatus = async (problemId, status) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/problems/${problemId}/status?status=${encodeURIComponent(status)}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || "Could not update problem status")
            }

            setProblems((currentProblems) =>
                currentProblems.map((problem) =>
                    problem.id === problemId
                        ? {
                            ...problem,
                            status: data.status
                        }
                        : problem
                )
            )

        } catch (error) {
            console.error(error)
            alert(error.message)
        }
    }

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

            setProjects((currentProjects) => [  
                ...currentProjects,
                {
                    id: data.project_id,
                    problem_id: data.problem_id,
                    university_id: data.university_id,
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    progress: 0
                }
            ])   

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

    const updateProjectMilestone = async (projectId, milestone, completed) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/projects/${projectId}/milestone?milestone=${milestone}&completed=${completed}`,
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
                    data.detail || "Could not update milestone"
                )
            }

            setProjects((currentProjects) =>
                currentProjects.map((project) =>
                    project.id === projectId
                        ? {
                            ...project,
                            [`${milestone}_completed`]: completed
                        }
                        : project
                )
            )

            setMilestoneMessage("Milestone updated successfully.")

            setTimeout(() => {
                setMilestoneMessage("")
            }, 2000)

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

    const acceptedProblems = problems.filter(
        (problem) => problem.status === "Accepted"
    ).length

    const resolvedProblems = problems.filter(
        (problem) => problem.status === "Resolved"
    ).length

    const criticalProblems = problems.filter(
        (problem) => problem.ai_priority === "critical"
    ).length

    const highPriorityProblems = problems.filter(
        (problem) => problem.ai_priority === "high"
    ).length

    const mediumPriorityProblems = problems.filter(
        (problem) => problem.ai_priority === "medium"
    ).length

    const lowPriorityProblems = problems.filter(
        (problem) => problem.ai_priority === "low"
    ).length

    const categoryCounts = problems.reduce((counts, problem) => {
        const category = problem.ai_category || "Unanalyzed"

        counts[category] = (counts[category] || 0) + 1

        return counts
    }, {})

    const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.description.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
        statusFilter === "All" ||
        problem.status === statusFilter

    return matchesSearch && matchesStatus
    })

    const filteredProjects = projects.filter((project) => {
        const searchText = projectSearch.toLowerCase()

        return (
            project.title?.toLowerCase().includes(searchText) ||
            project.problem_title?.toLowerCase().includes(searchText) ||
            project.university_name?.toLowerCase().includes(searchText) ||
            project.status?.toLowerCase().includes(searchText)
        )
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
                        navigate(`/problems/${problem.id}`, {
                            state: { from: "dashboard" }
                        })
                    }
                    className="problem-title-link"
                >
                    {problem.title}
                </span>
                </h3>

                <p><strong>Category:</strong>{" "}{problem.category}</p>
                <p><strong>District:</strong>{" "}{problem.district}</p>
                <p><strong>Status:</strong>{" "} {problem.status}</p>

                {problem.ai_category && (
                    <p>
                        <strong>AI Category:</strong>{" "}
                        {problem.ai_category.replace("_", " ")}
                    </p>
                )}

                {problem.ai_priority && (
                    <p>
                        <strong>AI Priority:</strong>{" "}
                        <span className={`dashboard-ai-priority ${problem.ai_priority}`}>
                            {problem.ai_priority.toUpperCase()}
                        </span>
                    </p>
                )}

                {problem.ai_summary && (
                    <div className="dashboard-ai-summary">
                        <strong>AI Summary:</strong>
                        <p>{problem.ai_summary}</p>
                    </div>
                )}

                {user.role === "Government" && (
                    <div className="problem-actions">

                        {problem.status === "Submitted" && (
                            <button
                                onClick={() =>
                                    updateProblemStatus(problem.id, "Under Review")
                                }
                            >
                                Review Problem
                            </button>
                        )}

                        {problem.status === "Under Review" && (
                            <button
                                onClick={() =>
                                    updateProblemStatus(problem.id, "Accepted")
                                }
                            >
                                Accept Problem
                            </button>
                        )}

                    </div>
                )}

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
                    <h3>Accepted</h3>
                    <p>{acceptedProblems}</p>
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
            <div className="ai-dashboard-overview">

                <div className="ai-overview-header">
                    <div>
                        <h2>AI-Powered Problem Insights</h2>
                        <p>
                            AI-generated prioritization and categorization
                            of reported community problems.
                        </p>
                    </div>

                    <span className="ai-dashboard-badge">
                        AI Powered
                    </span>
                </div>

                <div className="ai-priority-grid">

                    <div className="ai-priority-card critical">
                        <span>Critical</span>
                        <strong>{criticalProblems}</strong>
                        <small>Immediate attention</small>
                    </div>

                    <div className="ai-priority-card high">
                        <span>High</span>
                        <strong>{highPriorityProblems}</strong>
                        <small>High priority</small>
                    </div>

                    <div className="ai-priority-card medium">
                        <span>Medium</span>
                        <strong>{mediumPriorityProblems}</strong>
                        <small>Moderate priority</small>
                    </div>

                    <div className="ai-priority-card low">
                        <span>Low</span>
                        <strong>{lowPriorityProblems}</strong>
                        <small>Low priority</small>
                    </div>

                </div>

                <div className="ai-category-section">

                    <h3>Problems by AI Category</h3>

                    <div className="ai-category-list">

                        {Object.entries(categoryCounts).map(
                            ([category, count]) => {

                                const percentage =
                                    totalProblems > 0
                                        ? (count / totalProblems) * 100
                                        : 0

                                return (
                                    <div
                                        className="ai-category-row"
                                        key={category}
                                    >

                                        <div className="ai-category-info">
                                            <span>
                                                {category.replace("_", " ")}
                                            </span>

                                            <strong>
                                                {count}
                                            </strong>
                                        </div>

                                        <div className="ai-category-bar">
                                            <div
                                                className="ai-category-fill"
                                                style={{
                                                    width: `${percentage}%`
                                                }}
                                            />
                                        </div>

                                    </div>
                                )
                            }
                        )}

                    </div>

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
                <h2 className="project-tracking-title">Project Tracking</h2>

                {projects.length > 0 && (
                    <div className="project-tracking-search">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={projectSearch}
                            onChange={(event) =>
                                setProjectSearch(event.target.value)
                            }
                        />
                    </div>
                )}

                {projects.length === 0 ? (
                    <p>No projects have been created yet.</p>
                ) : (
                    <div className="my-problems-list">
                        {filteredProjects.map((project) => (
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

                                <div className="project-lifecycle government-lifecycle">

                                    <h4>Project Lifecycle</h4>

                                    <div className="milestone-list">

                                        <div className="milestone-item">
                                            <input
                                                type="checkbox"
                                                checked={project.proposal_completed || false}
                                                readOnly
                                            />
                                            <span>
                                                Proposal
                                            </span>
                                        </div>

                                        <div className="milestone-item">
                                            <input
                                                type="checkbox"
                                                checked={project.prototype_completed || false}
                                                readOnly
                                            />
                                            <span>
                                                Prototype Development
                                            </span>
                                        </div>

                                        <div className="milestone-item">
                                            <input
                                                type="checkbox"
                                                checked={project.testing_completed || false}
                                                readOnly
                                            />
                                            <span>
                                                Field Testing
                                            </span>
                                        </div>

                                        <div className="milestone-item">
                                            <input
                                                type="checkbox"
                                                checked={project.implementation_completed || false}
                                                readOnly
                                            />
                                            <span>
                                                Implementation
                                            </span>
                                        </div>

                                    </div>

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

                                <div className="project-lifecycle">

                                    <h4>Project Lifecycle</h4>

                                    <div className="milestone-list">

                                        <label className="milestone-item">
                                            <input
                                                type="checkbox"
                                                checked={project.proposal_completed || false}
                                                onChange={(event) =>
                                                    updateProjectMilestone(
                                                        project.id,
                                                        "proposal",
                                                        event.target.checked
                                                    )
                                                }
                                            />
                                            <span>
                                                Proposal
                                            </span>
                                        </label>

                                        <label className="milestone-item">
                                            <input
                                                type="checkbox"
                                                checked={project.prototype_completed || false}
                                                onChange={(event) =>
                                                    updateProjectMilestone(
                                                        project.id,
                                                        "prototype",
                                                        event.target.checked
                                                    )
                                                }
                                            />
                                            <span>
                                                Prototype Development
                                            </span>
                                        </label>

                                        <label className="milestone-item">
                                            <input
                                                type="checkbox"
                                                checked={project.testing_completed || false}
                                                onChange={(event) =>
                                                    updateProjectMilestone(
                                                        project.id,
                                                        "testing",
                                                        event.target.checked
                                                    )
                                                }
                                            />
                                            <span>
                                                Field Testing
                                            </span>
                                        </label>

                                        <label className="milestone-item">
                                            <input
                                                type="checkbox"
                                                checked={project.implementation_completed || false}
                                                onChange={(event) =>
                                                    updateProjectMilestone(
                                                        project.id,
                                                        "implementation",
                                                        event.target.checked
                                                    )
                                                }
                                            />
                                            <span>
                                                Implementation
                                            </span>
                                        </label>

                                    </div>

                                    {milestoneMessage && (
                                        <p className="milestone-message">
                                            {milestoneMessage}
                                        </p>
                                    )}

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