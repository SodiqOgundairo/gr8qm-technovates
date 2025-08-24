import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

const imageBasePath = "Gr8QMTechnovates/Images";
const svgIcons = `${imageBasePath}/svgicons`;

export const cloudinaryImages = {
  verticalLogo: cld
    .image(`${svgIcons}/Gr8QMNewlogoStraightDark_l8mdbv`)
    .format("auto")
    .quality("auto"),
};

export type CloudinaryImageKey = keyof typeof cloudinaryImages;
export default cld;
