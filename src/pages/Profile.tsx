import { getUser } from "../utils/authStorage";

/**
 * Profile page for the currently logged in user.
 */
function Profile() {
  const user = getUser();

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

{user.bio && <p>Bio: {user.bio}</p>}
    </main>
  );
}

export default Profile;
