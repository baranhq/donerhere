type MenuCategoryCardData = {
  category: string;
  image: string;
  link: string;
};

function MenuCategoryCard({ category, image, link }: MenuCategoryCardData) {
  return (
    <>
      <div className="lg:hidden bg-gray-100 hover:bg-orange-100 p-[10px] rounded-[15px] mr-[10px] ml-[10px]">
        <a href={link}>
          <div className="flex flex-1 flex">
            <div className="w-[100px] h-[100px] flex justify-center">
              <img
                src={image}
                className="object-contain bg-white rounded-[10px]"
                alt=""
              />
            </div>
            <div className="flex flex-1 justify-center items-center">
              <p>{category}</p>
            </div>
          </div>
        </a>
      </div>

      <div className="lg:block hidden max-w-[230px] max-h-[300px]">
        <div className="bg-gray-100 hover:bg-orange-100 p-[15px] rounded-[15px] mr-[5px] ml-[5px] w-[230px] h-[300px]">
          <a href={link}>
            <div>
              <img
                src={image}
                className="aspect-square w-[200px] h-[200px] object-contain bg-white rounded-[7px]"
                alt=""
              />
            </div>
            <div className="flex h-[80px] items-center justify-center">
              <p>{category}</p>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}

export default MenuCategoryCard;
