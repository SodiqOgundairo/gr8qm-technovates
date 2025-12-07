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
const Img = `${imageBasePath}/Img`;

export const cloudinaryImages = {
  verticalLogo: cld
    .image(`${svgIcons}/Gr8QMLogo_straightDefault_fg5vk2`)
    .format("auto")
    .quality("auto"),

  verticalLogoInvert: cld
    .image(`${svgIcons}/Gr8QMLogo_straight-invertDefault_dhkisd`)
    .format("auto")
    .quality("auto"),

  heroBg: cld
    .image(`${Img}/heroImg_lfqqdw`)
    .format("auto")
    .quality("auto"),

  aboutUsHero: cld
    .image(`${Img}/aboutUsHero`)
    .format("auto")
    .quality("auto"),

  visionMision: cld
    .image(`${Img}/visionMision`)
    .format("auto")
    .quality("auto"),

  ResearchDesignImage: cld
    .image(`${Img}/image_2_hqy2p0`)
    .format("auto")
    .quality("auto"),

  TrainingImage: cld
    .image(`${Img}/TrainingImage`)
    .format("auto")
    .quality("auto"),

  PintShop: cld
    .image(`${Img}/image_1_omivim`)
    .format("auto")
    .quality("auto"),

  contactHero: cld
    .image(`${Img}/contactHero`)
    .format("auto")
    .quality("auto"),
};

export type CloudinaryImageKey = keyof typeof cloudinaryImages;
export default cld;
