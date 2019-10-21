import { useEffect } from "react";

type TuseKeyPress = (
  key: string,
  direction: "up" | "down",
  callback: () => void
) => void;

const useKeyPress: TuseKeyPress = (key, direction, callback) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    console.log(`Pressed ${event.key} down`);
    if (direction === "down" && event.key === key) {
      console.log(`Pressed ${key} ${direction}`);
      callback();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    event.preventDefault();
    console.log(`Pressed ${event.key} up`);
    if (direction === "up" && event.key === key) {
      console.log(`Pressed ${key} ${direction}`);
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
};

export default useKeyPress;
