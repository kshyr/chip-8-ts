"use client";
import { CHIP8 } from "@/lib/chip8";
import { SCREEN_WIDTH, SCREEN_HEIGHT, SCALE_MOD } from "@/lib/renderer";
import { useEffect, useRef, useState } from "react";

async function getRomData(romName: string) {
  const data = await fetch("api/rom?name=" + romName).then((res) => res.json());
  return data;
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [romData, setRomData] = useState<number[]>([]);
  const chip8 = useRef<CHIP8 | null>(null);

  useEffect(() => {
    getRomData("IBM-logo.ch8").then((res) => {
      const raw = Array.from(Object.values(res.raw)) as number[];
      setRomData(raw);
    });
  }, []);

  useEffect(() => {
    if (romData.length && canvasRef.current && !chip8.current) {
      chip8.current = new CHIP8(canvasRef.current);
      chip8.current.load_rom(romData);

      for (let i = 0; i < romData.length / 2; i++) {
        chip8.current.tick();
      }
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
