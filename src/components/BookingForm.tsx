import { useState } from "react";
import { createBooking } from "../services/bookings";
import { getAccessToken } from "../utils/authStorage";
import styles from "./BookingForm.module.css";

type BookingFormProps = {
  venueId: string;
  maxGuests: number;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onBookingCreated: () => void;
};

function BookingForm({
  venueId,
  maxGuests,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onBookingCreated,
}: BookingFormProps) {
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const accessToken = getAccessToken();

    if (!accessToken) {
      setMessage("You must be logged in to make a booking.");
      return;
    }

    if (!dateFrom || !dateTo) {
      setMessage("Please select both dates.");
      return;
    }

    if (new Date(dateTo) <= new Date(dateFrom)) {
      setMessage("Check-out must be after check-in.");
      return;
    }

    if (guests < 1 || guests > maxGuests) {
      setMessage(`Guests must be between 1 and ${maxGuests}.`);
      return;
    }

    try {
      setSubmitting(true);

      await createBooking(
        {
          dateFrom,
          dateTo,
          guests,
          venueId,
        },
        accessToken,
      );

      setMessage("Booking created successfully!");
      onDateFromChange("");
      onDateToChange("");
      setGuests(1);

      await onBookingCreated();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.bookingSection}>
      <h2>Book this venue</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dateFrom">Check-in</label>
          <input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="dateTo">Check-out</label>
          <input
            id="dateTo"
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(event) => onDateToChange(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="guests">Guests</label>
          <input
            id="guests"
            type="number"
            min="1"
            max={maxGuests}
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Booking..." : "Book now"}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </section>
  );
}

export default BookingForm;
