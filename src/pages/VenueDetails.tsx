import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVenueById } from "../services/venues";
import type { Venue } from "../types/venue";
import styles from "./VenueDetails.module.css";

function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, [id]);

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

  return (
      <main>
        <Link to="/">← Back to venues</Link>
    
        <h1>{venue.name}</h1>

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
    </main>
  );
}

export default VenueDetails;
