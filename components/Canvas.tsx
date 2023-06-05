"use client";
import { useEffect, useRef, useState } from "react";

async function getRomData(romName: string) {
  const data = await fetch("api/rom?name=" + romName).then((res) => res.json());
  return data;
}
export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [romData, setRomData] = useState<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctx?.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    getRomData("test.ch8").then((res) => {
      const raw = Array.from(Object.values(res.raw)) as number[];
      setRomData(raw);
    });
  }, []);

  useEffect(() => {
    console.log(romData);
  }, [romData]);

  return <canvas ref={canvasRef} className="border"></canvas>;
}
