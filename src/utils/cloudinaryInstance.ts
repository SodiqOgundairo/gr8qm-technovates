import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

const imageBasePath = "LLCImageRepo/Images";

export const cloudinaryImages = {
  heroBg: cld
    .image(`${imageBasePath}/Img/kxmlpsmvyjxpj9p2endu`)
    .format("auto")
    .quality("auto"),
  aboutUs: cld
    .image(`${imageBasePath}/Img/eax8f5vjyzm1i2flp29e`)
    .format("auto")
    .quality("auto"),
  contactUs: cld
    .image(`${imageBasePath}/Img/xay0ytb2p9nixkzsttfr`)
    .format("auto")
    .quality("auto"),
  training: cld
    .image(`${imageBasePath}/Img/b4nnl2i1z7srmw9r96v9`)
    .format("auto")
    .quality("auto"),
};

export type CloudinaryImageKey = keyof typeof cloudinaryImages;
export default cld;
