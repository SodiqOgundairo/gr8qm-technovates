import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

const imageBasePath = "Gr8QMTechnovates/Images";
const svgIcons = `${imageBasePath}/svgicons`;
// const svgGIFs = `${imageBasePath}/svgGIFs`;
// const svgImg = `${imageBasePath}/svgImg`;

export const cloudinaryImages = {
  verticalLogo: cld
    .image(`${svgIcons}/Gr8QMNewlogoStraight_u2cohw`)
    .format("auto")
    .quality("auto"),
};

export type CloudinaryImageKey = keyof typeof cloudinaryImages;
export default cld;
