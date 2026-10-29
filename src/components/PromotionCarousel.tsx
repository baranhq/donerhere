import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../../@/components/ui/carousel";
import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PromotionCarouselData = {
  children: React.ReactNode;
};

function PromotionCarousel({ children }: PromotionCarouselData) {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    [],
  );
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    const updatePlaying = () => setPlaying(autoplay.isPlaying());
    updatePlaying();
    api.on("autoplay:play", updatePlaying);
    api.on("autoplay:stop", updatePlaying);
    updateButtons();

    api.on("select", updateButtons);
    api.on("reInit", updateButtons);

    return () => {
      api.off("autoplay:play", updatePlaying);
      api.off("autoplay:stop", updatePlaying);
      api.off("select", updateButtons);
      api.off("reInit", updateButtons);
    };
  }, [api, autoplay]);

  return (
    <div className="relative flex w-full justify-center align-middle items-center group overflow-hidden">
      <Carousel
        setApi={setApi}
        className="max-h-[500px] max-w-[1200px] h-full w-full lg:rounded-[15px]"
        plugins={reducedMotion ? [] : [autoplay]}
      >
        <CarouselContent>{children}</CarouselContent>
        {canScrollPrev && (
          <CarouselPrevious className="border-0 bg-white/70 rounded-[100%] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200" />
        )}
        {canScrollNext && (
          <CarouselNext className="border-0 bg-white/70 rounded-[100%] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200" />
        )}
        {!reducedMotion && (canScrollPrev || canScrollNext) && (
          <button
            type="button"
            aria-label={playing ? "Pause promotions" : "Play promotions"}
            className="absolute right-4 bottom-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-stone-800 hover:bg-white"
            onClick={() => {
              if (autoplay.isPlaying()) autoplay.stop();
              else autoplay.play();
            }}
          >
            {playing ? (
              <Pause size={17} aria-hidden="true" />
            ) : (
              <Play size={17} aria-hidden="true" />
            )}
          </button>
        )}
      </Carousel>
    </div>
  );
}

export default PromotionCarousel;
