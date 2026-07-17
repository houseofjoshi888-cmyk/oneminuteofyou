"use client";
import { forwardRef } from "react";

export const Canvas = forwardRef<HTMLCanvasElement, React.CanvasHTMLAttributes<HTMLCanvasElement>>(function Canvas(props, ref) {
  return <canvas ref={ref} {...props}>Your browser does not support canvas.</canvas>;
});
