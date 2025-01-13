import { FC } from "react";
import { AttributeSet } from "../../services/graphql/types";
import { toKebabCase } from "../../utils/helpers";

interface AttributeProps {
  attribute: AttributeSet;
  selectedValue: string;
  onSelect?: (attributeId: string, valueId: string) => void;
  variant?: 'product' | 'cart';
}

const Attribute: FC<AttributeProps> = ({ attribute, selectedValue, onSelect, variant = 'cart' }) => {
  const getAttributeClass = () => {
    return attribute.type === "swatch" ? "swatch-attribute" : "text-attribute";
  };

  const getItemClasses = (isSelected: boolean, variant: 'product' | 'cart') => {
    const baseClass = getAttributeClass();
    const selectedClass = isSelected ? 'selected' : '';
    
    return variant === 'product'
      ? `${baseClass} ${selectedClass} p-4 fs-5`
      : `${baseClass} ${selectedClass} p-2 fs-6`;
  };

  const getCartItemTestId = (itemValue: string, isSelected: boolean) => {
    const attributeName = toKebabCase(attribute.name);
    const baseTestId = `cart-item-attribute-${attributeName}-${toKebabCase(itemValue)}`;
    return isSelected ? `${baseTestId}-selected` : baseTestId;
  };

  return (
    <>
      <div className={variant === 'product' ? "row m-0 fs-3 fw-bold mb-2" : "row"}>
        {attribute.name}:
      </div>
      <div className={variant === 'product' ? "d-flex" : "row"}>
        {attribute.items.map((item) => (
          <div
            key={item.id}
            data-testestid={variant === 'product' ? `product-attribute-${attribute.name.toLowerCase()}-${item.value.toLowerCase()}` : `${getCartItemTestId(item.displayValue, selectedValue === item.id)}`}
            className={variant === 'product' ? "product-attribute-item me-3" : "col p-0"}
            onClick={() => onSelect && onSelect(attribute.id, item.id)}
            style={{ cursor: onSelect ? 'pointer' : 'default' }}
          >
            <div
              className={getItemClasses(selectedValue === item.id, variant)}
              style={
                attribute.type === "swatch"
                  ? { backgroundColor: item.displayValue }
                  : undefined
              }
              data-testid={variant === 'cart' ? getCartItemTestId(item.displayValue, selectedValue === item.id) : undefined}
            >
              {attribute.type !== "swatch" && item.displayValue}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Attribute;