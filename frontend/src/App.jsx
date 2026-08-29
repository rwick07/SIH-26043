import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import ReportProblem from "./pages/ReportProblem"
import Problems from "./pages/Problems"
import ProblemDetails from "./pages/ProblemDetails"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportProblem />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App