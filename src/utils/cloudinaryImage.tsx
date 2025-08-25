
import { AdvancedImage } from '@cloudinary/react';
import { cloudinaryImages, type CloudinaryImageKey } from './cloudinaryBank';

interface CloudinaryImageProps {
  imageKey: CloudinaryImageKey;
  className?: string;
  alt?: string;
}

const CloudinaryImage = ({ imageKey, className, alt }: CloudinaryImageProps) => {
  const img = cloudinaryImages[imageKey];
  return <AdvancedImage cldImg={img} className={className} alt={alt} />;
};

export default CloudinaryImage;