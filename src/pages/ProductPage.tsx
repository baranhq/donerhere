import { useSite } from "../store/site";
import { useParams } from "react-router";
import { useEffect } from "react";

import Products from "../components/Product";

function ProductPage() {
  const {
    catalog: { products },
  } = useSite();
  const { product, size } = useParams();

  const selectedProduct = products.find((item) => item.link === product);

  useEffect(() => {
    if (!selectedProduct) return;
    const title =
      selectedProduct.seoTitle || `${selectedProduct.name} | DönerHere!`;
    const description =
      selectedProduct.seoDescription || selectedProduct.description || "";
    document.title = title;
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.append(meta);
    }
    meta.content = description;
    return () => {
      document.title = "DönerHere!";
      meta?.remove();
    };
  }, [selectedProduct]);

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
