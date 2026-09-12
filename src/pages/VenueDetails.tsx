import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVenueById } from "../services/venues";
import { getUser } from "../utils/authStorage";
import VenueCalendar from "../components/VenueCalendar";
import BookingForm from "../components/BookingForm";
import type { Venue } from "../types/venue";
import styles from "./VenueDetails.module.css";

function VenueDetails() {
  const { id } = useParams();
  const user = getUser();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!id) {
      return;
    }

    async function loadVenue() {
      try {
        const data = await getVenueById(id as string);
        setVenue(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id, refreshKey]);

  function handleDateSelect(date: string) {
    if (!dateFrom || dateTo || date <= dateFrom) {
      setDateFrom(date);
      setDateTo("");
      return;
    }

    setDateTo(date);
  }

  function handleBookingCreated() {
    setRefreshKey((current) => current + 1);
  }

  if (!id) {
    return (
      <main>
        <p>Venue not found.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main>
        <p>Loading venue...</p>
      </main>
    );
  }

  if (!venue) {
    return (
      <main>
        <p>Venue not found.</p>
      </main>
    );
  }

  const canEdit =
    user?.venueManager === true && venue.owner?.name === user.name;

  return (
    <main className={styles.main}>
      <Link to="/">← Back to venues</Link>

      <h1>{venue.name}</h1>

      {canEdit && (
        <p>
          <Link to={`/venues/${venue.id}/edit`}>Edit Venue</Link>
        </p>
      )}

      {venue.media.length > 0 && (
        <img
          className={styles.image}
          src={venue.media[0].url}
          alt={venue.media[0].alt || venue.name}
        />
      )}

      <p>{venue.description}</p>
      <p>Price: ${venue.price}</p>
      <p>Guests: {venue.maxGuests}</p>

      <VenueCalendar
        bookings={venue.bookings}
        selectedDateFrom={dateFrom}
        selectedDateTo={dateTo}
        onDateSelect={handleDateSelect}
      />

      <BookingForm
        venueId={venue.id}
        maxGuests={venue.maxGuests}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onBookingCreated={handleBookingCreated}
      />
    </main>
  );
}

export default VenueDetails;
