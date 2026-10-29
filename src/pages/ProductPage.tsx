import { useSite } from "../store/site";
import { useParams } from "react-router";

import Products from "../components/Product";

function ProductPage() {
  const {
    catalog: { products },
  } = useSite();
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
      selectedSize={selectedSize}
    />
  );
}

export default ProductPage;
