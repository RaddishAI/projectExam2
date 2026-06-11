import { useEffect, useState } from "react";
import { getVenues, searchVenues } from "../services/venues";
import type { Venue } from "../types/venue";
import styles from "./Home.module.css";
import VenueCard from "../components/VenueCard";

function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadVenues() {
      setLoading(true);

      try {
        const data = search.trim()
          ? await searchVenues(search)
          : await getVenues();

        setVenues(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, [search]);

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>Welcome to Holidaze</h2>

      <label>
        Search venues
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or description"
        />
      </label>
      
      {loading ? (
        <p>Loading venues...</p>
      ) : venues.length === 0 ? (
        <p>No venues found.</p>
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
