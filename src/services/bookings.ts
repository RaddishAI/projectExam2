import { API_BASE_URL, API_KEY } from "./api";
import type { Venue } from "../types/venue";

export type CreateBookingPayload = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue: Venue;
};

export async function createBooking(
  payload: CreateBookingPayload,
  accessToken: string,
) {
  const response = await fetch(`${API_BASE_URL}/holidaze/bookings`, {
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
    throw new Error(data.errors?.[0]?.message ?? "Booking failed");
  }

  return data;
}

/**
 * Fetches bookings for a specific profile, including venue details.
 */
export async function getProfileBookings(
  profileName: string,
  accessToken: string,
): Promise<Booking[]> {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(profileName)}/bookings?_venue=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message ?? "Failed to fetch bookings");
  }

  return data.data;
}
