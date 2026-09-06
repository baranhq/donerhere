import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../@/components/ui/carousel";

function PromotionCarousel() {
  return (
    <div className="flex w-full justify-center align-middle items-center group">
      <Carousel
        className="max-h-[500px] w-[100%] max-w-[1500px]"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent>
          <CarouselItem>
            <a href="" className="flex w-full h-full ">
              <img
                src="src/assets/promotions/promotion.png"
                alt=""
                className="flex justify-center align-middle items-center w-full h-full rounded-[25px]"
              />
            </a>
          </CarouselItem>
          <CarouselItem>
            <a href="" className="flex w-full h-full ">
              <img
                src="src/assets/promotions/promotion2.png"
                alt=""
                className="flex justify-center align-middle items-center w-full h-full rounded-[25px]"
              />
            </a>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="border-0 bg-white/70 rounded-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <CarouselNext className="border-0 bg-white/70 rounded-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </Carousel>
    </div>
  );
}

export default PromotionCarousel;
