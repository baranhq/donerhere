import donerWrap from "../src/assets/products/doner-wrap.png";
import donerWrap2 from "../src/assets/products/doner-wrap2.png";
import fries from "../src/assets/products/fries.png";
import baklava from "../src/assets/products/baklava.png";
import ayran from "../src/assets/products/ayran.png";

export type Product = {
  name: string;
  description?: string;

  sizes?: {
    name: "Small" | "Regular" | "Large";
    weight: number;
    unit: "g" | "kg" | "ml" | "l";
    price: number;
    oldPrice?: number;
    link: string;
    available: boolean;
  }[];

  ingredients?: string[];
  image: string;
  category: string;
  link: string;
  popular?: boolean;
  available?: boolean;
};

export const products: Product[] = [
  {
    name: "The Original",

    description:
      "Freshly prepared chicken döner wrapped with crisp salad and our signature sauce.",

    sizes: [
      {
        name: "Small",
        weight: 250,
        unit: "g",
        price: 8.99,
        link: "small",
        available: true,
      },
      {
        name: "Regular",
        weight: 350,
        unit: "g",
        price: 11.99,
        link: "regular",
        available: true,
      },
      {
        name: "Large",
        weight: 500,
        unit: "g",
        price: 14.99,
        link: "large",
        available: true,
      },
    ],

    ingredients: [
      "Chicken döner",
      "Lettuce",
      "Tomato",
      "Onion",
      "Signature sauce",
    ],

    image: donerWrap,
    category: "doner-wraps",
    link: "the-original",
    popular: true,
    available: true,
  },

  {
    name: "The Crispy",

    description:
      "Crispy chicken döner wrapped with fresh vegetables and our signature sauce.",

    sizes: [
      {
        name: "Small",
        weight: 250,
        unit: "g",
        price: 6.99,
        oldPrice: 8.99,
        link: "small",
        available: true,
      },
      {
        name: "Regular",
        weight: 350,
        unit: "g",
        price: 7.99,
        oldPrice: 10.99,
        link: "regular",
        available: true,
      },
      {
        name: "Large",
        weight: 500,
        unit: "g",
        price: 10.99,
        oldPrice: 13.99,
        link: "large",
        available: true,
      },
    ],

    ingredients: [
      "Chicken döner",
      "Lettuce",
      "Tomato",
      "Carrot",
      "Crispy topping",
      "Signature sauce",
    ],

    image: donerWrap2,
    category: "doner-wraps",
    link: "the-crispy",
    available: true,
  },

  {
    name: "Fries",

    description: "Crispy golden fries, perfectly seasoned and ready to enjoy.",

    sizes: [
      {
        name: "Small",
        weight: 100,
        unit: "g",
        price: 2.49,
        link: "small",
        available: true,
      },
      {
        name: "Regular",
        weight: 150,
        unit: "g",
        price: 2.99,
        link: "regular",
        available: true,
      },
      {
        name: "Large",
        weight: 250,
        unit: "g",
        price: 3.99,
        link: "large",
        available: true,
      },
    ],

    ingredients: ["Potatoes", "Vegetable oil", "Salt"],

    image: fries,
    category: "fries",
    link: "fries",
    available: true,
  },

  {
    name: "Baklava",

    description:
      "Traditional baklava made with flaky pastry, pistachios and sweet syrup.",

    sizes: [
      {
        name: "Regular",
        weight: 100,
        unit: "g",
        price: 2.49,
        link: "regular",
        available: true,
      },
    ],

    ingredients: ["Phyllo pastry", "Pistachios", "Sugar syrup", "Butter"],

    image: baklava,
    category: "desserts",
    link: "baklava",
    available: true,
  },

  {
    name: "Ayran",

    description:
      "Refreshing traditional yogurt drink, lightly salted and served chilled.",

    sizes: [
      {
        name: "Small",
        weight: 250,
        unit: "ml",
        price: 1.49,
        link: "small",
        available: true,
      },
      {
        name: "Regular",
        weight: 330,
        unit: "ml",
        price: 1.99,
        link: "regular",
        available: true,
      },
      {
        name: "Large",
        weight: 500,
        unit: "ml",
        price: 2.49,
        link: "large",
        available: true,
      },
    ],

    ingredients: ["Yogurt", "Water", "Salt"],

    image: ayran,
    category: "drinks",
    link: "ayran",
    available: true,
  },
];
