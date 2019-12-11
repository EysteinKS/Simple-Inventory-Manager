import React from "react";
import Icons from "./Icons";

interface IWarning {
  [x: string]: any;
}

export default function Warning({ children, ...props }: IWarning) {
  return (
    <>
      <Icons.Warning {...props} />
      {children ? children : null}
    </>
  );
}
