export type VenueMedia = {
  url: string;
  alt: string;
};

export type VenueMeta = {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};

export type VenueLocation = {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
  lat: number;
  lng: number;
};

export type VenueBookingCustomer = {
  name: string;
  email: string;
};

export type VenueBooking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  customer?: VenueBookingCustomer;
};

export type VenueOwner = {
  name: string;
  email: string;
};

export type Venue = {
  id: string;
  name: string;
  description: string;
  media: VenueMedia[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: VenueLocation;
  bookings?: VenueBooking[];
  owner?: VenueOwner;
};

export type VenuesResponse = {
  data: Venue[];
  meta: Record<string, unknown>;
};

export type CreateVenuePayload = {
  name: string;
  description: string;
  media: VenueMedia[];
  price: number;
  maxGuests: number;
  meta: VenueMeta;
  location: VenueLocation;
};
