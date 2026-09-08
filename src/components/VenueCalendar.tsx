import { useState } from "react";
import type { VenueBooking } from "../types/venue";
import styles from "./VenueCalendar.module.css";

type VenueCalendarProps = {
  bookings?: VenueBooking[];
  selectedDateFrom?: string;
  selectedDateTo?: string;
  onDateSelect?: (date: string) => void;
};

function VenueCalendar({
  bookings = [],
  selectedDateFrom,
  selectedDateTo,
  onDateSelect,
}: VenueCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function isDateBooked(date: Date) {
    return bookings.some((booking) => {
      const dateFrom = new Date(booking.dateFrom);
      const dateTo = new Date(booking.dateTo);

      date.setHours(0, 0, 0, 0);
      dateFrom.setHours(0, 0, 0, 0);
      dateTo.setHours(0, 0, 0, 0);

      return date >= dateFrom && date <= dateTo;
    });
  }

  function isDateSelected(date: Date) {
    const formattedDate = formatDate(date);

    if (selectedDateFrom && formattedDate === selectedDateFrom) {
      return true;
    }

    if (selectedDateTo && formattedDate === selectedDateTo) {
      return true;
    }

    if (selectedDateFrom && selectedDateTo) {
      return formattedDate > selectedDateFrom && formattedDate < selectedDateTo;
    }

    return false;
  }

  function handlePreviousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function handleNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  const calendarDays = [];

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const booked = isDateBooked(date);
    const selected = isDateSelected(date);
    const formattedDate = formatDate(date);

    calendarDays.push(
      <button
        key={day}
        type="button"
        disabled={booked}
        onClick={() => onDateSelect?.(formattedDate)}
        className={`${styles.day} ${
          booked ? styles.booked : styles.available
        } ${selected ? styles.selected : ""}`}
      >
        {day}
      </button>,
    );
  }

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className={styles.calendarSection}>
      <h2>Availability</h2>

      <div className={styles.calendarHeader}>
        <button type="button" onClick={handlePreviousMonth}>
          ←
        </button>

        <h3>{monthName}</h3>

        <button type="button" onClick={handleNextMonth}>
          →
        </button>
      </div>

      <div className={styles.weekdays}>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      <div className={styles.calendarGrid}>{calendarDays}</div>

      <div className={styles.legend}>
        <span>
          <span className={`${styles.legendBox} ${styles.available}`} />
          Available
        </span>

        <span>
          <span className={`${styles.legendBox} ${styles.booked}`} />
          Booked
        </span>
      </div>
    </section>
  );
}

export default VenueCalendar;
