type LocationFilterData = {
  name: string;
  isActive: boolean;
  onClick: () => void;
};

function LocationFilter({ name, isActive, onClick }: LocationFilterData) {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-[90%] border-[1px] lg:-mt-[1px] -mt-[1px]"></div>
        <button onClick={onClick}>
          <div
            className={`flex flex-col w-[250px] rounded-[15px] select-none ${isActive ? "bg-[#ff5a1e] text-white" : "hover:bg-gray-50"}`}
          >
            <div className="flex h-[70px]">
              <div className="flex flex-1 justify-center items-center">
                <div>{name}</div>
              </div>
            </div>
          </div>
        </button>
        <div className="w-[90%] border-[1px] lg:-mb-[1px] -mb-[1px]"></div>
      </div>
    </>
  );
}

export default LocationFilter;
