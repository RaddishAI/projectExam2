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
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, ...user } = response.data;

      saveAuth(accessToken, user);
      navigate("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed");
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
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </main>
  );
}

export default Login;
