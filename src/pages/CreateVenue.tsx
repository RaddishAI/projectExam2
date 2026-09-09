import { useState } from "react";
import type { SubmitEvent } from "react";
import { createVenue } from "../services/venues";
import { getAccessToken, getUser } from "../utils/authStorage";

function CreateVenue() {
  const user = getUser();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");
  const [price, setPrice] = useState(0);
  const [maxGuests, setMaxGuests] = useState(1);

  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const [message, setMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user?.venueManager) {
      setMessage("Only venue managers can create venues.");
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      setMessage("You must be logged in to create a venue.");
      return;
    }

    try {
      await createVenue(
        {
          name,
          description,
          media: mediaUrl
            ? [
                {
                  url: mediaUrl,
                  alt: mediaAlt,
                },
              ]
            : [],
          price,
          maxGuests,
          meta: {
            wifi,
            parking,
            breakfast,
            pets,
          },
          location: {
            address: address || null,
            city: city || null,
            zip: zip || null,
            country: country || null,
            continent: continent || null,
            lat,
            lng,
          },
        },
        accessToken,
      );

      setMessage("Venue created successfully!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to create venue",
      );
    }
  }

  if (!user) {
    return (
      <main>
        <h2>Create Venue</h2>
        <p>You must be logged in to view this page.</p>
      </main>
    );
  }

  if (!user.venueManager) {
    return (
      <main>
        <h2>Create Venue</h2>
        <p>Only venue managers can create venues.</p>
      </main>
    );
  }

  return (
    <main>
      <h2>Create Venue</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="mediaUrl">Image URL</label>
          <input
            id="mediaUrl"
            type="url"
            value={mediaUrl}
            onChange={(event) => setMediaUrl(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="mediaAlt">Image Alt Text</label>
          <input
            id="mediaAlt"
            type="text"
            value={mediaAlt}
            onChange={(event) => setMediaAlt(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="price">Price per night</label>
          <input
            id="price"
            type="number"
            min="0"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            required
          />
        </div>

        <div>
          <label htmlFor="maxGuests">Max Guests</label>
          <input
            id="maxGuests"
            type="number"
            min="1"
            value={maxGuests}
            onChange={(event) => setMaxGuests(Number(event.target.value))}
            required
          />
        </div>

        <fieldset>
          <legend>Facilities</legend>

          <label>
            <input
              type="checkbox"
              checked={wifi}
              onChange={(event) => setWifi(event.target.checked)}
            />
            WiFi
          </label>

          <label>
            <input
              type="checkbox"
              checked={parking}
              onChange={(event) => setParking(event.target.checked)}
            />
            Parking
          </label>

          <label>
            <input
              type="checkbox"
              checked={breakfast}
              onChange={(event) => setBreakfast(event.target.checked)}
            />
            Breakfast
          </label>

          <label>
            <input
              type="checkbox"
              checked={pets}
              onChange={(event) => setPets(event.target.checked)}
            />
            Pets allowed
          </label>
        </fieldset>

        <div>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="zip">ZIP</label>
          <input
            id="zip"
            type="text"
            value={zip}
            onChange={(event) => setZip(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="continent">Continent</label>
          <input
            id="continent"
            type="text"
            value={continent}
            onChange={(event) => setContinent(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="lat">Latitude</label>
          <input
            id="lat"
            type="number"
            step="any"
            value={lat}
            onChange={(event) => setLat(Number(event.target.value))}
          />
        </div>

        <div>
          <label htmlFor="lng">Longitude</label>
          <input
            id="lng"
            type="number"
            step="any"
            value={lng}
            onChange={(event) => setLng(Number(event.target.value))}
          />
        </div>

        <button type="submit">Create Venue</button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}

export default CreateVenue;
