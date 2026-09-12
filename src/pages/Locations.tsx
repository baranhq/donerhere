import { locations } from "../../data/locations";
import LocationsCard from "../components/LocationsCard";

function Locations() {
  return (
    <>
      <div className="sm:h-[120px] h-[70px] flex items-center justify-center">
        <h2 className="text-center font-bold sm:text-[36px] text-[24px]/[28px]">
          Find Your Nearest DönerHere!
        </h2>
      </div>
      <div className="flex justify-center items-center">
        <div className="max-w-[1200px]">
          <div className="flex flex-wrap justify-center">
            {locations.map((location) => (
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
