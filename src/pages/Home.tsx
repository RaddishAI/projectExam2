import { useEffect, useState } from "react";
import { getVenues } from "../services/venues";
import type { Venue } from "../types/venue";
import styles from "./Home.module.css"
import VenueCard from "../components/VenueCard";

function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVenues() {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, []);

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>Welcome to Holidaze</h2>

      {loading ? (
        <p>Loading venues...</p>
      ) : (
<div>
  {venues.slice(0, 10).map((venue) => (
    <VenueCard key={venue.id} venue={venue} />
  ))}
</div>
      )}
    </main>
  );
}

export default Home;