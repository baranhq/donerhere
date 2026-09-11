import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../@/components/ui/carousel";

type FoodCarouselData = {
  children: React.ReactNode;
};

function FoodCarousel({ children }: FoodCarouselData) {
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
    <Carousel setApi={setApi} className="flex justify-center group">
      <CarouselContent>{children}</CarouselContent>
      {canScrollPrev && (
        <CarouselPrevious className="border-0 bg-white/70 rounded-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}

      {canScrollNext && (
        <CarouselNext className="border-0 bg-white/70 rounded-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </Carousel>
  );
}

export default FoodCarousel;
