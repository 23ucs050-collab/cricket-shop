import batImage from "../assets/bat.jpg";
import ballImage from "../assets/ball.jpg";
import glovesImage from "../assets/gloves.jpg";
import helmetImage from "../assets/helmet.jpg";
import padsImage from "../assets/pads.jpg";
import shoesImage from "../assets/shoes.jpg";

const products = [
  {
    id: 1,
    name: "SS English Willow Cricket Bat",
    category: "Bats",
    price: 8500,
    image: batImage,
    description: "Premium English willow cricket bat."
  },

  {
    id: 2,
    name: "SG Cricket Ball",
    category: "Balls",
    price: 850,
    image: ballImage,
    description: "Premium leather cricket ball."
  },

  {
    id: 3,
    name: "Cricket Batting Gloves",
    category: "Gloves",
    price: 1800,
    image: glovesImage,
    description: "Comfortable batting gloves."
  },

  {
    id: 4,
    name: "Cricket Helmet",
    category: "Helmets",
    price: 2500,
    image: helmetImage,
    description: "Strong and comfortable cricket helmet."
  },

  {
    id: 5,
    name: "Cricket Batting Pads",
    category: "Pads",
    price: 2200,
    image: padsImage,
    description: "Lightweight cricket batting pads."
  },

  {
    id: 6,
    name: "Cricket Shoes",
    category: "Shoes",
    price: 3200,
    image: shoesImage,
    description: "Comfortable cricket shoes."
  }
];

export default products;