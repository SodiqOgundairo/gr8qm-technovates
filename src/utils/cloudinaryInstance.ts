import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dmxfjy079", // Replace with your Cloudinary cloud name
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


