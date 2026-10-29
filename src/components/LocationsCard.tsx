import type { Location } from "../data/locations";

function LocationsCard({
  name,
  address,
  city,
  country,
  open,
  close,
  phone,
  email,
  image,
}: Location) {
  return (
    <div className="h-fit w-full rounded-[15px] bg-gray-100 p-[15px]">
      <img
        className="h-[160px] w-full rounded-[10px] bg-white object-contain p-4"
        src={image}
        alt=""
      />
      <h2 className="text-[24px]/[28px] text-center font-bold mt-[5px]">
        {name}
      </h2>
      <div className="mt-[5px]">
        <p>{address},</p>
        <p>
          {city}, {country}
        </p>
        <p>
          {open} - {close}
        </p>
        <p>{phone}</p>
        <p>{email}</p>
      </div>
    </div>
  );
}

export default LocationsCard;
