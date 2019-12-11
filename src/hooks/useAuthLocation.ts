import { useSelector } from "react-redux";
import { RootState } from "../redux/types";
import { useMemo } from "react";
import { hexToHSL } from "../styles/colors";

const useAuthLocation = () => {
  const { name, url, color } = useSelector((state: RootState) => {
    const { name, logoUrl, primaryColor } = state.auth.location;
    return {
      name,
      url: logoUrl,
      color: primaryColor as string
    };
  });

  const secondary = useMemo(() => {
    if (!color) return "#666";

    let hsl = hexToHSL(color);
    return `hsl(${hsl[0]}, ${hsl[1] * 1 - 10}%, ${hsl[2] * 1 + 10}%)`;
  }, [color]);

  const dark = useMemo(() => {
    if (!color) return "#DDD";

    let hsl = hexToHSL(color);
    hsl[1] = hsl[1] * 1 - 40;
    hsl[2] = hsl[2] * 1 + 35;
    return `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)`;
  }, [color]);

  return { name, url, color, secondary, dark };
};

export default useAuthLocation;
