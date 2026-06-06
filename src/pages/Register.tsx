import { useState } from "react";
import type { SubmitEvent } from "react";
import { register } from "../services/auth";

/**
 * Registration page for new Holidaze users.
 */
function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    venueManager: false,
  });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  
    try {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          venueManager: formData.venueManager,
        });
      
        alert("Account created successfully!");
      } catch (error) {
        alert(error instanceof Error ? error.message : "Registration failed");
      }
  }

  return (
    <main>
      <h2>Create account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Username</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(event) =>
              setFormData({
                ...formData,
                name: event.target.value,
              })
            }
          />
        </div>

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

        <div>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(event) =>
              setFormData({
                ...formData,
                confirmPassword: event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="venueManager">Register as venue manager</label>
          <input
            id="venueManager"
            name="venueManager"
            type="checkbox"
            checked={formData.venueManager}
            onChange={(event) =>
              setFormData({
                ...formData,
                venueManager: event.target.checked,
              })
            }
          />
        </div>

        <button type="submit">Create account</button>
      </form>
    </main>
  );
}

export default Register;
