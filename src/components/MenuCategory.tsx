import { useLocation, useNavigate } from "react-router";

type Category = {
  name: string;
  slug: string;
  image: string;
};

function MenuCategory({ name, slug, image }: Category) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = location.pathname === `/menu/${slug}`;

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-[90%] border-[1px] lg:-mt-[1px] -mt-[3px]"></div>
        <button onClick={() => navigate(`/menu/${slug}`)}>
          <div
            className={`flex flex-col w-[250px] rounded-[15px] select-none ${isActive ? "bg-[#ff5a1e] text-white" : "hover:bg-gray-50"}`}
          >
            <div className="flex h-[70px]">
              <div className="flex flex-1 justify-center items-center max-w-[90px]">
                <img className="w-[50px] h-[50px]" src={image}></img>
              </div>
              <div className="flex flex-1 justify-center items-center">
                <div>{name}</div>
              </div>
            </div>
          </div>
        </button>
        <div className="w-[90%] border-[1px] lg:-mb-[1px] -mb-[3px]"></div>
      </div>
    </>
  );
}

export default MenuCategory;
