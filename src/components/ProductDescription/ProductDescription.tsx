import { FC } from "react";

const ProductDescription: FC<{ description: string }> = ({ description }) => {
  const hasHTMLTags = /<[a-z][\s\S]*>/i.test(description);

  if (!hasHTMLTags) {
    return (
      <div className="col text-start" data-testid="product-description">
        {description}
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

  const renderHTML = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    return Array.from(doc.body.children).map(convertElement);
  };

  return (
    <div className="col text-start" data-testid="product-description">
      {renderHTML(description)}
    </div>
  );
};

export default ProductDescription;