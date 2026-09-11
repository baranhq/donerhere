import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../../@/components/ui/carousel";
import { useEffect, useState } from "react";

type PromotionCarouselData = {
  children: React.ReactNode;
};

function PromotionCarousel({ children }: PromotionCarouselData) {
  const [api, setApi] = useState<any>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateButtons();

    api.on("select", updateButtons);
    api.on("reInit", updateButtons);

    return () => {
      api.off("select", updateButtons);
      api.off("reInit", updateButtons);
    };
  }, [api]);

  return (
    <div className="flex w-full justify-center align-middle items-center group overflow-hidden">
      <Carousel
        setApi={setApi}
        className="max-h-[500px] max-w-[1200px] h-full w-full lg:rounder-[15px]"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent>{children}</CarouselContent>
        {canScrollPrev && (
          <CarouselPrevious className="border-0 bg-white/70 rounded-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )}
        {canScrollNext && (
          <CarouselNext className="border-0 bg-white/70 rounded-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )}
      </Carousel>
    </div>
  );
}

export default PromotionCarousel;
