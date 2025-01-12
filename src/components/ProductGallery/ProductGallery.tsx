import { FC, useState } from 'react';
import './ProductGallery.css';

// Image gallery component with thumbnail navigation
interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: FC<ProductGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Navigation handlers for gallery
  const handleNextImage = () => {
    if (selectedImage < images.length - 1) {
      setSelectedImage(prev => prev + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(prev => prev - 1);
    }
  };

  return (
    <div className="product-gallery d-flex" data-testid="product-gallery">
      <div className="thumbnail-gallery">
        {images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Product ${index + 1}`}
            className={`thumbnail ${selectedImage === index ? "selected" : ""}`}
            onClick={() => setSelectedImage(index)}
          />
        ))}
      </div>
      <div className="main-image-container position-relative">
        <img
          src={images[selectedImage]}
          alt="Selected product view"
          className="main-image"
        />
        {selectedImage > 0 && (
          <button 
            className="gallery-arrow prev-arrow"
            onClick={handlePrevImage}
          >
            ←
          </button>
        )}
        {selectedImage < images.length - 1 && (
          <button 
            className="gallery-arrow next-arrow"
            onClick={handleNextImage}
          >
            →
          </button>
        )}
      </div>
    </div>
  );
};
export default ProductGallery;