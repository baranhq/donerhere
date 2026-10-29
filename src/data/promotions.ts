import promotion from "../assets/promotions/promotion.png";
import promotion2 from "../assets/promotions/promotion2.png";
export type PromotionsData = {
  image: string;
  link: string;
};

export const promotions: PromotionsData[] = [
  {
    image: promotion,
    link: "/product/the-crispy/small",
  },
  {
    image: promotion2,
    link: "",
  },
];
