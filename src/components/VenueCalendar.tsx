import { useState } from "react";
import type { VenueBooking } from "../types/venue";
import styles from "./VenueCalendar.module.css";

type VenueCalendarProps = {
  bookings?: VenueBooking[];
};

function VenueCalendar({ bookings = [] }: VenueCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

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

    calendarDays.push(
      <div
        key={day}
        className={`${styles.day} ${booked ? styles.booked : styles.available}`}
      >
        {day}
      </div>,
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
