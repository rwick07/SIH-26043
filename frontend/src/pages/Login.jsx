import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleLogin = async (event) => {
    event.preventDefault()

    const formData = new FormData()

    formData.append("email", email)
    formData.append("password", password)

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Login failed")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setMessage("Login successful!")

      navigate("/")

    } catch (error) {
      console.error(error)
      setMessage(error.message)
    }
  }

  return (
    <div>
      <Navbar />

      <main className="login-page">

        <h1>Login</h1>

        <form onSubmit={handleLogin}>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit">
            Login
          </button>

        </form>

        {message && (
          <p>{message}</p>
        )}

      </main>
    </div>
  )
}

export default Login    