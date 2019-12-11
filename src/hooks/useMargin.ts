import { useEffect, useState, useMemo } from "react";

const useMargin = (width: number, border: number = 0) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setInnerWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [innerWidth]);

  const sideMargin = useMemo(() => {
    let windowWidth = innerWidth;
    let remaining = windowWidth - width;
    let margin = remaining / 2 - border;
    if (margin < 0) {
      margin = 0;
    }
    return margin.toString();
  }, [width, innerWidth, border]);

  return sideMargin;
};

export default useMargin;
