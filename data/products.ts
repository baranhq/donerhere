export type Product = {
  name: string;

  price: number;

  oldPrice?: number;

  description?: string;

  weight?: {
    value: number;
    unit: "g" | "kg" | "ml" | "l";
  };

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
    price: 11.99,
    description:
      "Freshly prepared chicken döner wrapped with crisp salad and our signature sauce.",
    weight: {
      value: 350,
      unit: "g",
    },
    ingredients: [
      "Chicken döner",
      "Lettuce",
      "Tomato",
      "Onion",
      "Signature sauce",
    ],
    image: "../src/assets/products/doner-wrap.png",
    category: "doner-wraps",
    link: "",
    popular: true,
    available: false,
  },

  {
    name: "The Crispy",
    price: 7.99,
    oldPrice: 10.99,
    description:
      "Crispy chicken döner wrapped with fresh vegetables and our signature sauce.",
    weight: {
      value: 350,
      unit: "g",
    },
    ingredients: [
      "Chicken döner",
      "Lettuce",
      "Tomato",
      "Carrot",
      "Crispy topping",
      "Signature sauce",
    ],
    image: "../src/assets/products/doner-wrap2.png",
    category: "doner-wraps",
    link: "the-crispy",
    available: true,
  },

  {
    name: "Fries",
    price: 2.99,
    description: "Crispy golden fries, perfectly seasoned and ready to enjoy.",
    weight: {
      value: 150,
      unit: "g",
    },
    ingredients: ["Potatoes", "Vegetable oil", "Salt"],
    image: "../src/assets/products/fries.png",
    category: "fries",
    link: "",
    available: true,
  },

  {
    name: "Baklava",
    price: 2.49,
    description:
      "Traditional baklava made with flaky pastry, pistachios and sweet syrup.",
    weight: {
      value: 100,
      unit: "g",
    },
    ingredients: ["Phyllo pastry", "Pistachios", "Sugar syrup", "Butter"],
    image: "../src/assets/products/baklava.png",
    category: "desserts",
    link: "",
    available: true,
  },

  {
    name: "Ayran",
    price: 1.99,
    description:
      "Refreshing traditional yogurt drink, lightly salted and served chilled.",
    weight: {
      value: 330,
      unit: "ml",
    },
    ingredients: ["Yogurt", "Water", "Salt"],
    image: "../src/assets/products/ayran.png",
    category: "drinks",
    link: "",
    available: true,
  },
];
