import { useState } from "react";
import { locations } from "../../data/locations";
import LocationsCard from "../components/LocationsCard";
import LocationFilter from "../components/LocationFilter";
import LocationFilterButton from "../components/LocationFilterButton";

function Locations() {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");

  const countries = [
    "All",
    ...new Set(locations.map((location) => location.country)),
  ];

  const cities = [
    "All",
    ...new Set(
      locations
        .filter(
          (location) =>
            selectedCountry === "All" || location.country === selectedCountry,
        )
        .map((location) => location.city),
    ),
  ];

  const filteredLocations = locations.filter(
    (location) =>
      (selectedCountry === "All" || location.country === selectedCountry) &&
      (selectedCity === "All" || location.city === selectedCity),
  );

  return (
    <>
      <div className="sm:h-[120px] h-[70px] flex items-center justify-center">
        <h2 className="text-center font-bold sm:text-[36px] text-[24px]/[28px]">
          Find Your Nearest DönerHere!
        </h2>
      </div>
      <div className="flex-1">
        <div className="lg:hidden block w-full h-[50px]">
          <LocationFilterButton>
            <div className="flex flex-col gap-[30px] mr-[10px]">
              <div className="flex flex-col items-center rounded-[15px] w-fit font-semibold h-fit border-2 p-[5px]">
                <p>Countries</p>
                {countries.map((country) => (
                  <LocationFilter
                    name={country}
                    isActive={selectedCountry === country}
                    onClick={() => {
                      setSelectedCountry(country);
                      setSelectedCity("All");
                    }}
                  ></LocationFilter>
                ))}
              </div>
              <div className="flex flex-col items-center rounded-[15px] w-fit font-semibold h-fit border-2 p-[5px]">
                <p>Cities</p>
                {cities.map((city) => (
                  <LocationFilter
                    name={city}
                    isActive={selectedCity === city}
                    onClick={() => setSelectedCity(city)}
                  ></LocationFilter>
                ))}
              </div>
            </div>
          </LocationFilterButton>
        </div>
      </div>
      <div className="flex justify-center items-center mb-[10px]">
        <div className="flex w-full max-w-[1200px]">
          <div className="hidden lg:flex flex-col gap-[10px] mr-[10px]">
            <div className="flex flex-col items-center bg-gray-100 rounded-[15px] p-[15px] w-[280px] font-semibold h-fit">
              {countries.map((country) => (
                <LocationFilter
                  name={country}
                  isActive={selectedCountry === country}
                  onClick={() => {
                    setSelectedCountry(country);
                    setSelectedCity("All");
                  }}
                ></LocationFilter>
              ))}
            </div>
            <div className="flex flex-col items-center bg-gray-100 rounded-[15px] p-[15px] w-[280px] font-semibold h-fit">
              {cities.map((city) => (
                <LocationFilter
                  name={city}
                  isActive={selectedCity === city}
                  onClick={() => setSelectedCity(city)}
                ></LocationFilter>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap lg:justify-start justify-center gap-[5px]">
            {filteredLocations.map((location) => (
              <LocationsCard
                name={location.name}
                address={location.address}
                city={location.city}
                country={location.country}
                open={location.open}
                close={location.close}
                phone={location.phone}
                email={location.email}
                image={location.image}
              ></LocationsCard>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Locations;
