import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import ReportProblem from "./pages/ReportProblem"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportProblem />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App