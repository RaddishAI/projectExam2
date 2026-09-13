import { useEffect, useState } from "react";
import { getVenues, searchVenues } from "../services/venues";
import type { Venue } from "../types/venue";
import styles from "./Home.module.css";
import VenueCard from "../components/VenueCard";

const VENUES_PER_PAGE = 12;

function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [visibleVenues, setVisibleVenues] = useState(VENUES_PER_PAGE);

  useEffect(() => {
    async function loadVenues() {
      setLoading(true);
      setError("");
      setVisibleVenues(VENUES_PER_PAGE);

      try {
        const data = search.trim()
          ? await searchVenues(search)
          : await getVenues();

        setVenues(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load venues",
        );
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, [search]);

  function handleLoadMore() {
    setVisibleVenues((current) => current + VENUES_PER_PAGE);
  }

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
        <p role="status" aria-live="polite">
          Loading venues...
        </p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : venues.length === 0 ? (
        <p role="status" aria-live="polite">
          No venues found.
        </p>
      ) : (
        <>
          <div className={styles.venueGrid}>
            {venues.slice(0, visibleVenues).map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>

          {visibleVenues < venues.length && (
            <button type="button" onClick={handleLoadMore}>
              Load more
            </button>
          )}
        </>
      )}
    </main>
  );
}

export default Home;
