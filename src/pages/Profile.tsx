import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Link } from "react-router-dom";
import { updateAvatar } from "../services/auth";
import { getProfileBookings, type Booking } from "../services/bookings";
import { getProfileVenues } from "../services/venues";
import type { Venue } from "../types/venue";
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
  const [managedVenues, setManagedVenues] = useState<Venue[]>([]);
  const [managedVenuesLoading, setManagedVenuesLoading] = useState(false);
  const [managedVenuesError, setManagedVenuesError] = useState("");

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
  }, [user?.name]);

  useEffect(() => {
    async function loadManagedVenues() {
      if (!user?.venueManager) {
        return;
      }

      const accessToken = getAccessToken();

      if (!accessToken) {
        setManagedVenuesError(
          "You must be logged in to view your managed venues.",
        );
        return;
      }

      setManagedVenuesLoading(true);

      try {
        const result = await getProfileVenues(user.name, accessToken);
        setManagedVenues(result);
      } catch (error) {
        setManagedVenuesError(
          error instanceof Error
            ? error.message
            : "Failed to load managed venues",
        );
      } finally {
        setManagedVenuesLoading(false);
      }
    }

    loadManagedVenues();
  }, [user?.name, user?.venueManager]);

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

      {user.venueManager && (
        <section>
          <h3>Managed Venues</h3>

          {managedVenuesLoading && <p>Loading managed venues...</p>}

          {managedVenuesError && <p>{managedVenuesError}</p>}

          {!managedVenuesLoading &&
            !managedVenuesError &&
            managedVenues.length === 0 && <p>You have no managed venues.</p>}

          {!managedVenuesLoading &&
            !managedVenuesError &&
            managedVenues.map((venue) => (
              <article key={venue.id}>
                <h4>{venue.name}</h4>

                <p>
                  <Link to={`/venues/${venue.id}/edit`}>Edit Venue</Link>
                </p>

                {!venue.bookings || venue.bookings.length === 0 ? (
                  <p>No bookings for this venue.</p>
                ) : (
                  venue.bookings
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(a.dateFrom).getTime() -
                        new Date(b.dateFrom).getTime(),
                    )
                    .map((booking) => (
                      <div key={booking.id}>
                        {booking.customer && (
                          <>
                            <p>Customer: {booking.customer.name}</p>
                            <p>Email: {booking.customer.email}</p>
                          </>
                        )}

                        <p>
                          Check-in:{" "}
                          {new Date(booking.dateFrom).toLocaleDateString()}
                        </p>
                        <p>
                          Check-out:{" "}
                          {new Date(booking.dateTo).toLocaleDateString()}
                        </p>
                        <p>Guests: {booking.guests}</p>
                      </div>
                    ))
                )}
              </article>
            ))}
        </section>
      )}
    </main>
  );
}

export default Profile;
