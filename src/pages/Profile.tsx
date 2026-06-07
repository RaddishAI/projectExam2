import { useState } from "react";
import type { SubmitEvent } from "react";
import { updateAvatar } from "../services/auth";
import { getAccessToken, getUser, saveAuth } from "../utils/authStorage";

/**
 * Profile page for the currently logged in user.
 */
function Profile() {
  const user = getUser();

  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url ?? "");
  const [avatarAlt, setAvatarAlt] = useState(user?.avatar?.alt ?? "");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  
    if (!user) {
      return;
    }
  
    const accessToken = getAccessToken();
  
    if (!accessToken) {
      alert("You must be logged in to update your avatar.");
      return;
    }
  
    try {
      const response = await updateAvatar(
        user.name,
        {
          avatar: {
            url: avatarUrl,
            alt: avatarAlt,
          },
        },
        accessToken,
      );
  
      saveAuth(accessToken, response.data);
      alert("Avatar updated successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Avatar update failed");
    }
  }

  if (!user) {
    return (
      <main>
        <h2>Profile</h2>
        <p>You must be logged in to view this page.</p>
      </main>
    );
  }

  return (
    <main>
      <h2>Profile</h2>

      {user.avatar?.url && (
        <img
          src={user.avatar.url}
          alt={user.avatar.alt || `${user.name}'s avatar`}
          width="120"
          height="120"
        />
      )}

      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Venue Manager: {user.venueManager ? "Yes" : "No"}</p>

      <form onSubmit={handleSubmit}>
        <h3>Update Avatar</h3>

        <div>
          <label htmlFor="avatarUrl">Avatar URL</label>
          <input
            id="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="avatarAlt">Avatar Alt Text</label>
          <input
            id="avatarAlt"
            type="text"
            value={avatarAlt}
            onChange={(event) => setAvatarAlt(event.target.value)}
          />
        </div>

        <button type="submit">Update Avatar</button>
      </form>

      {user.bio && <p>Bio: {user.bio}</p>}
    </main>
  );
}

export default Profile;
