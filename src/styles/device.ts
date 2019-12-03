const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px"
};

type MediaTargetTypes = "min-width" | "max-width" | "min-height" | "max-height";

const addMediaQuery = (size: string, target: MediaTargetTypes) => {
  return (style: string) => `@media (${target}: ${size}) {
    ${style}
  }`;
};

export const device = {
  mobileS: (style: string) => addMediaQuery(size.mobileS, "min-width")(style),
  mobileM: (style: string) => addMediaQuery(size.mobileM, "min-width")(style),
  mobileL: (style: string) => addMediaQuery(size.mobileL, "min-width")(style),
  tablet: (style: string) => addMediaQuery(size.tablet, "min-width")(style),
  laptop: (style: string) => addMediaQuery(size.laptop, "min-width")(style),
  laptopL: (style: string) => addMediaQuery(size.laptopL, "min-width")(style),
  desktop: (style: string) => addMediaQuery(size.desktop, "min-width")(style)
};

export const tallDevice = (style: string) =>
  addMediaQuery("900px", "min-height")(style);
