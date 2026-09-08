import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
  JSON.parse(localStorage.getItem("user"))
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <strong>SIH 26043</strong>
      </div>

      <div className="navbar-brand-center">
        JanSetu
      </div>

      <div className="navbar-right">
        <Link to="/">Home</Link>
        <Link to="/problems">Problems</Link>

        {user?.role === "Citizen" && (
          <Link to="/report">Report Problem</Link>
        )}

        {user ? (
          <>

            <Link to="/dashboard">
              Dashboard
            </Link>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

    </nav>
  );
}

export default Navbar;    