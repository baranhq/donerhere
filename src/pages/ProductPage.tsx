import { useParams } from "react-router";
import { products } from "../../data/products";
import Products from "../components/Product";

function ProductPage() {
  const { product, size } = useParams();

  const selectedProduct = products.find((item) => item.link === product);

  if (!selectedProduct) {
    return <div>Product not found</div>;
  }

  const selectedSize = selectedProduct.sizes?.find(
    (item) => item.link === size,
  );

  if (!selectedSize) {
    return <div>Size not found</div>;
  }

  return (
    <Products
      {...selectedProduct}
      price={selectedSize.price}
      oldPrice={selectedSize.oldPrice}
      weight={selectedSize.weight}
      unit={selectedSize.unit}
    />
  );
}

export default ProductPage;
