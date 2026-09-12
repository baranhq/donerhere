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
      <button onClick={() => navigate(`/menu/${slug}`)}>
        <div className="w-full flex justify-center">
          <div className="bg-gray-200 h-[1px] w-[225px]"></div>
        </div>
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
    </>
  );
}

export default MenuCategory;
