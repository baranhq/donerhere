export type Product = {
  name: string;
  price: string;
  oldPrice?: string;
  description?: string;
  image: string;
  category: string;
};

export const products: Product[] = [
  {
    name: "Döner Wrap",
    price: "11,99€",
    description:
      "Freshly prepared döner wrapped with salad and our signature sauce.",
    image: "../src/assets/products/doner-wrap.png",
    category: "doner-wraps",
  },
  {
    name: "Döner Wrap 2",
    price: "7,99€",
    oldPrice: "10,99€",
    description:
      "Delicious döner wrap with fresh vegetables and our signature sauce.",
    image: "../src/assets/products/doner-wrap2.png",
    category: "doner-wraps",
  },
  {
    name: "Fries",
    price: "2,99€",
    description: "Crispy golden fries.",
    image: "../src/assets/products/fries.png",
    category: "fries",
  },
  {
    name: "Baklava",
    price: "2,49€",
    description:
      "Traditional baklava with layers of flaky pastry, pistachios and syrup.",
    image: "../src/assets/products/baklava.png",
    category: "desserts",
  },
  {
    name: "Ayran",
    price: "1,99€",
    description: "Refreshing traditional Turkish yogurt drink.",
    image: "../src/assets/products/ayran.png",
    category: "drinks",
  },
];
