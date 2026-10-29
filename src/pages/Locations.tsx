import { useState } from "react";
import { MapPin, SlidersHorizontal } from "lucide-react";
import { locations } from "../data/locations";
import LocationsCard from "../components/LocationsCard";
import LocationFilter from "../components/LocationFilter";

export default function Locations() {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const countries = ["All", ...new Set(locations.map((l) => l.country))];
  const cities = [
    "All",
    ...new Set(
      locations
        .filter(
          (l) => selectedCountry === "All" || l.country === selectedCountry,
        )
        .map((l) => l.city),
    ),
  ];
  const filtered = locations.filter(
    (l) =>
      (selectedCountry === "All" || l.country === selectedCountry) &&
      (selectedCity === "All" || l.city === selectedCity),
  );
  return (
    <main className="page locations-page">
      <h1>Find Your Nearest DönerHere!</h1>
      <div className="locations-layout">
        <aside className="locations-filters">
          <div className="filter-heading">
            <SlidersHorizontal size={18} aria-hidden="true" />
            <h2>Find a location</h2>
          </div>
          <div className="filter-groups">
            <section>
              <h3>Country</h3>
              {countries.map((country) => (
                <LocationFilter
                  key={country}
                  name={country === "All" ? "All countries" : country}
                  isActive={selectedCountry === country}
                  onClick={() => {
                    setSelectedCountry(country);
                    setSelectedCity("All");
                  }}
                />
              ))}
            </section>
            <section>
              <h3>City</h3>
              {cities.map((city) => (
                <LocationFilter
                  key={city}
                  name={city === "All" ? "All cities" : city}
                  isActive={selectedCity === city}
                  onClick={() => setSelectedCity(city)}
                />
              ))}
            </section>
          </div>
          {(selectedCity !== "All" || selectedCountry !== "All") && (
            <button
              className="text-link"
              onClick={() => {
                setSelectedCity("All");
                setSelectedCountry("All");
              }}
            >
              Clear filters
            </button>
          )}
          <p className="filter-count" role="status">
            <MapPin size={15} aria-hidden="true" />
            {filtered.length} locations
          </p>
        </aside>
        <div className="locations-grid">
          {filtered.map((location, index) => (
            <LocationsCard
              key={`${location.country}:${location.city}:${index}`}
              {...location}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
