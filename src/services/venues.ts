import { API_BASE_URL, API_KEY } from "./api";
import type { CreateVenuePayload, Venue, VenuesResponse } from "../types/venue";

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

/**
 * Searches venues by name or description.
 */
export async function searchVenues(query: string): Promise<Venue[]> {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/venues/search?q=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to search venues");
  }

  const result: VenuesResponse = await response.json();

  return result.data;
}

/**
 * Fetches a single venue by id, including bookings and owner.
 */
export async function getVenueById(id: string): Promise<Venue> {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/venues/${id}?_bookings=true&_owner=true`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch venue");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Creates a new venue.
 */
export async function createVenue(
  payload: CreateVenuePayload,
  accessToken: string,
): Promise<Venue> {
  const response = await fetch(`${API_BASE_URL}/holidaze/venues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message ?? "Failed to create venue");
  }

  return data.data;
}

/**
 * Updates an existing venue.
 */
export async function updateVenue(
  id: string,
  payload: CreateVenuePayload,
  accessToken: string,
): Promise<Venue> {
  const response = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message ?? "Failed to update venue");
  }

  return data.data;
}

/**
 * Deletes an existing venue.
 */
export async function deleteVenue(
  id: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    let message = "Failed to delete venue";

    try {
      const data = await response.json();
      message = data.errors?.[0]?.message ?? message;
    } catch {
      // Some DELETE responses may not contain JSON.
    }

    throw new Error(message);
  }
}
