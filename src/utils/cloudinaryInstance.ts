import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

export const cloudinaryImages = {
  heroBg: cld
    .image("LLCImageRepo/Images/Img/kxmlpsmvyjxpj9p2endu")
    .format("auto")
    .quality("auto"),
};
export type CloudinaryImageKey = keyof typeof cloudinaryImages;
export default cld;


