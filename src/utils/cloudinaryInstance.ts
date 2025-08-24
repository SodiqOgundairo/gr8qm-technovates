import { Cloudinary } from "@cloudinary/url-gen";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

const imageBasePath = "LLCImageRepo/Images";

export const cloudinaryImages = {
  heroBg: cld
    .image(`${imageBasePath}/Img/kxmlpsmvyjxpj9p2endu`)
    .format(format("auto"))
    .quality(quality("auto")),
  aboutUs: cld
    .image(`${imageBasePath}/Img/eax8f5vjyzm1i2flp29e`)
    .format(format("auto"))
    .quality(quality("auto")),
  contactUs: cld
    .image(`${imageBasePath}/Img/xay0ytb2p9nixkzsttfr`)
    .format(format("auto"))
    .quality(quality("auto")),
  training: cld
    .image(`${imageBasePath}/Img/b4nnl2i1z7srmw9r96v9`)
    .format(format("auto"))
    .quality(quality("auto")),
};

export type CloudinaryImageKey = keyof typeof cloudinaryImages;
export default cld;
