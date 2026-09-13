import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/authStorage";
import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    clearAuth();
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Holidaze
        </Link>

        <nav aria-label="Primary navigation">
          {user ? (
            <>
              <Link to="/profile">Profile</Link>

              {user.venueManager && (
                <Link to="/venues/create">Create Venue</Link>
              )}

              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
