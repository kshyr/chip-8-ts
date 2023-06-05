"use client";
import { CHIP8, SCREEN_WIDTH, SCREEN_HEIGHT } from "@/lib/chip8";
import { useEffect, useRef, useState } from "react";

const SCALE_MOD = 16;

async function getRomData(romName: string) {
  const data = await fetch("api/rom?name=" + romName).then((res) => res.json());
  return data;
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [romData, setRomData] = useState<number[]>([]);
  const chip8 = useRef<CHIP8 | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    getRomData("test.ch8").then((res) => {
      const raw = Array.from(Object.values(res.raw)) as number[];
      setRomData(raw);
    });
  }, []);

  useEffect(() => {
    if (romData.length && !chip8.current) {
      chip8.current = new CHIP8();
      chip8.current.load_rom(romData);
    }
  }, [romData]);

  return (
    <canvas
      ref={canvasRef}
      className="border"
      width={SCREEN_WIDTH * SCALE_MOD}
      height={SCREEN_HEIGHT * SCALE_MOD}
    ></canvas>
  );
}
