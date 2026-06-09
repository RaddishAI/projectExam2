import { API_BASE_URL } from "./api";
import type { Venue, VenuesResponse } from "../types/venue";

/**
 * Fetches all venues from the Holidaze API.
 */
export async function getVenues(): Promise<Venue[]> {
  const response = await fetch(`${API_BASE_URL}/holidaze/venues`);

  if (!response.ok) {
    throw new Error("Failed to fetch venues");
  }

  const result: VenuesResponse = await response.json();

  return result.data;
}