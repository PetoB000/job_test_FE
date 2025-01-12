import { FC, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import Attribute from "../../components/Attribute/Attribute";
import ProductGallery from "../../components/ProductGallery/ProductGallery";
import { useProduct } from "../../hooks/useProduct";
import ProductDescription from "../../components/ProductDescription/ProductDescription";
import "./ProductPage.css";
const ProductPage: FC = () => {
  const { productId } = useParams();
  const product = useProduct(productId || "");
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const { addToCart } = useContext(CartContext);

  const handleAttributeSelect = (attributeId: string, valueId: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: valueId,
    }));
  };

  const areAllAttributesSelected = () => {
    if (!product?.attributes?.length) return true;
    return product.attributes.every((attr) => selectedAttributes[attr.id]);
  };

  return (
    <div className="container mt-5">
      <div className="row pt-5">
        <div className="col-7">
          {product?.gallery && <ProductGallery images={product.gallery} />}
        </div>
        <div className="col-5 p-0">
          <h1 className="text-start fw-bold">{product?.name}</h1>
          <div className="row">
            {product?.attributes?.map((attribute) => (
              <div className="mb-4" key={attribute.id} data-testid={`product-attribute-${attribute.id}`}>
                <Attribute
                  attribute={attribute}
                  selectedValue={selectedAttributes[attribute.id]}
                  onSelect={handleAttributeSelect}
                  variant="product"
                />
              </div>
            ))}
          </div>
          <div className="row d-flex flex-column text-start">
            <div className="col fs-4 fw-bold mb-2">PRICE:</div>
            <div className="col fs-3 fw-bold mb-4">
              ${product?.price.toFixed(2)}
            </div>
          </div>
          <div className="row mb-4">
            <div className="col text-start">
              <button
                className="place-order-button"
                data-testid="add-to-cart"
                disabled={!product?.in_stock || !areAllAttributesSelected()}
                onClick={() => {
                  addToCart(product!, selectedAttributes);
                }}
              >
                ADD TO CART
              </button>
            </div>
          </div>
          {product?.description && (
            <ProductDescription description={product.description} />
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
