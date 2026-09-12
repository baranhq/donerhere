export type Category = {
  name: string;
  slug: string;
  image: string;
};

export const categories: Category[] = [
  {
    name: "Döner Wraps",
    slug: "doner-wraps",
    image: "../src/assets/products/doner-wrap.png",
  },
  {
    name: "Fries",
    slug: "fries",
    image: "../src/assets/products/fries.png",
  },
  {
    name: "Desserts",
    slug: "desserts",
    image: "../src/assets/products/baklava.png",
  },
  {
    name: "Drinks",
    slug: "drinks",
    image: "../src/assets/products/ayran.png",
  },
];
