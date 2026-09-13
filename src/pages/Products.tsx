import Products from "../components/Product";

function Productss() {
  return (
    <>
      <div>
        <Products
          name={"The Crispy"}
          oldPrice="10,99"
          price={"7,99"}
          image={"src/assets/products/doner-wrap2.png"}
          category={"doner-wraps"}
          link={"the-crispy"}
        ></Products>
      </div>
    </>
  );
}

export default Productss;
