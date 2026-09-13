import { useState } from "react";
import type { SubmitEvent } from "react";
import { login } from "../services/auth";
import { saveAuth } from "../utils/authStorage";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

/**
 * Login page for existing Holidaze users.
 */
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      setSubmitting(true);

      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { accessToken, ...user } = response.data;

      saveAuth(accessToken, user);
      navigate("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.main}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData({
                ...formData,
                email: event.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(event) =>
              setFormData({
                ...formData,
                password: event.target.value,
              })
            }
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </main>
  );
}

export default Login;
