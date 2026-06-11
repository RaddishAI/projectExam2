import { Link } from "react-router-dom";
import type { Venue } from "../types/venue";
import styles from "./VenueCard.module.css";

type VenueCardProps = {
  venue: Venue;
};

function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link to={`/venues/${venue.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        {venue.media.length > 0 && (
          <img
            className={styles.image}
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
          />
        )}

        <h3>{venue.name}</h3>
        <p>{venue.description}</p>
        <p>Price: ${venue.price}</p>
        <p>Guests: {venue.maxGuests}</p>
      </article>
    </Link>
  );
}

export default VenueCard;