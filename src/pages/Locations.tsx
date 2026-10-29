import { filterPanel, filterHeading } from "../components/filters/styles";
import { ui } from "../styles/ui";
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
    <main className={`${ui.page} [&>h1]:mt-3 [&>h1]:mb-8 [&>h1]:text-center`}>
      <h1>Find Your Nearest DönerHere!</h1>
      <div className="grid grid-cols-[220px_minmax(0,1fr)] items-start gap-6 max-[760px]:grid-cols-1">
        <aside className={`${filterPanel} sticky top-24 max-[760px]:static`}>
          <div className="mb-4 flex items-center gap-2 px-3 pt-2 [&_h2]:m-0 [&_h2]:text-base">
            <SlidersHorizontal
              className="shrink-0"
              size={18}
              aria-hidden="true"
            />
            <h2 className="m-0! text-base! leading-5 whitespace-nowrap">
              Find a location
            </h2>
          </div>
          <div className="grid gap-6 max-[760px]:grid-cols-2 max-[760px]:gap-4">
            <section>
              <h3 className={filterHeading}>Country</h3>
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
              <h3 className={filterHeading}>City</h3>
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
              className={`${ui.textLink}`}
              onClick={() => {
                setSelectedCity("All");
                setSelectedCountry("All");
              }}
            >
              Clear filters
            </button>
          )}
          <p
            className="mb-0! flex items-center gap-1.5 border-t border-[#efded5] pt-4 text-[.8rem] text-[#826d61]"
            role="status"
          >
            <MapPin size={15} aria-hidden="true" />
            {filtered.length} locations
          </p>
        </aside>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4 [&>div]:w-full">
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
