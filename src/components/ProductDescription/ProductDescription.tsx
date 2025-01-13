import { FC } from "react";

const ProductDescription: FC<{ description: string }> = ({ description }) => {
  // Parse the content first
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, 'text/html');
  
  // If body has no child elements but has text, return the text directly
  if (doc.body.children.length === 0 && doc.body.textContent) {
    return (
      <div className="col text-start" data-testid="product-description">
        {doc.body.textContent}
      </div>
    );
  }

  const convertElement = (node: Element): JSX.Element => {
    const TagName = node.tagName.toLowerCase() as keyof JSX.IntrinsicElements;
    const children = Array.from(node.children).map(child => convertElement(child as Element));
    
    return (
      <TagName key={Math.random()}>
        {children.length > 0 ? children : node.textContent}
      </TagName>
    );
  };

  return (
    <div className="col text-start" data-testid="product-description">
      {Array.from(doc.body.children).map(convertElement)}
    </div>
  );
};

export default ProductDescription;