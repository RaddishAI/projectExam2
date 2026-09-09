import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { updateAvatar } from "../services/auth";
import { getProfileBookings, type Booking } from "../services/bookings";
import { getAccessToken, getUser, saveAuth } from "../utils/authStorage";

/**
 * Profile page for the currently logged in user.
 */
function Profile() {
  const user = getUser();

  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url ?? "");
  const [avatarAlt, setAvatarAlt] = useState(user?.avatar?.alt ?? "");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      if (!user) {
        setBookingsLoading(false);
        return;
      }

      const accessToken = getAccessToken();

      if (!accessToken) {
        setBookingsError("You must be logged in to view your bookings.");
        setBookingsLoading(false);
        return;
      }

      try {
        const result = await getProfileBookings(user.name, accessToken);
        setBookings(result);
      } catch (error) {
        setBookingsError(
          error instanceof Error ? error.message : "Failed to load bookings",
        );
      } finally {
        setBookingsLoading(false);
      }
    }

    loadBookings();
  }, [user]);

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

  const now = new Date();

  const upcomingBookings = bookings
    .filter((booking) => new Date(booking.dateTo) >= now)
    .sort(
      (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
    );

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

      <section>
        <h3>Upcoming Bookings</h3>

        {bookingsLoading && <p>Loading bookings...</p>}

        {bookingsError && <p>{bookingsError}</p>}

        {!bookingsLoading &&
          !bookingsError &&
          upcomingBookings.length === 0 && (
            <p>You have no upcoming bookings.</p>
          )}

        {!bookingsLoading &&
          !bookingsError &&
          upcomingBookings.map((booking) => (
            <article key={booking.id}>
              <h4>{booking.venue.name}</h4>

              {booking.venue.media[0] && (
                <img
                  src={booking.venue.media[0].url}
                  alt={booking.venue.media[0].alt || booking.venue.name}
                  width="240"
                />
              )}

              <p>Check-in: {new Date(booking.dateFrom).toLocaleDateString()}</p>
              <p>Check-out: {new Date(booking.dateTo).toLocaleDateString()}</p>
              <p>Guests: {booking.guests}</p>
            </article>
          ))}
      </section>
    </main>
  );
}

export default Profile;
