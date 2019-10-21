const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px"
};

const addMediaQuery = (size: string) => {
  return (style: string) => `@media (min-width: ${size}) {
    ${style}
  }`;
};

export const device = {
  mobileS: (style: string) => addMediaQuery(size.mobileS)(style),
  mobileM: (style: string) => addMediaQuery(size.mobileM)(style),
  mobileL: (style: string) => addMediaQuery(size.mobileL)(style),
  tablet: (style: string) => addMediaQuery(size.tablet)(style),
  laptop: (style: string) => addMediaQuery(size.laptop)(style),
  laptopL: (style: string) => addMediaQuery(size.laptopL)(style),
  desktop: (style: string) => addMediaQuery(size.desktop)(style)
};
