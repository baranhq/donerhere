import type { Location } from "../../data/locations";

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
    <div className="bg-gray-100 p-[15px] w-[300px] h-fit m-[5px] rounded-[15px]">
      <img
        className="w-auto h-[180px] bg-white object-contain rounded-[10px]"
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
