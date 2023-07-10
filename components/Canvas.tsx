"use client";
import { CHIP8 } from "@/lib/chip8";
import { SCREEN_WIDTH, SCREEN_HEIGHT, SCALE_MOD } from "@/lib/renderer";
import { useEffect, useRef, useState } from "react";

function getAllRoms() {
  const data = fetch("api/roms").then((res) => res.json());
  return data;
}

function getRomData(romName: string) {
  const data = fetch("api/rom?name=" + romName).then((res) => res.json());
  return data;
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedRom, setSelectedRom] = useState<string>("IBM-logo.ch8");
  const [romFiles, setRomFiles] = useState<string[]>([selectedRom]);
  const [romData, setRomData] = useState<number[]>([]);
  const chip8 = useRef<CHIP8 | null>(null);

  useEffect(() => {
    getAllRoms().then((res) => {
      setRomFiles(res.files);
    });
  }, []);

  useEffect(() => {
    getRomData(selectedRom).then((res) => {
      const raw = Array.from(Object.values(res.raw)) as number[];
      setRomData(raw);
    });
  }, [selectedRom]);

  useEffect(() => {
    if (canvasRef.current) {
      chip8.current = new CHIP8(canvasRef.current);
      chip8.current.load(romData);

      for (let i = 0; i < romData.length / 2; i++) {
        var now = new Date().getTime();
        while (new Date().getTime() < now + 20) {
          /* Do nothing */
        }
        chip8?.current?.tick();
      }
    }
  }, [romData]);

  return (
    <section className="flex flex-col gap-2">
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-fit p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={selectedRom}
        onChange={(e) => setSelectedRom(e.target.value)}
      >
        {romFiles?.map((file) => {
          return (
            <option key={file} value={file}>
              {file}
            </option>
          );
        })}
      </select>
      <canvas
        ref={canvasRef}
        className="border"
        width={SCREEN_WIDTH * SCALE_MOD}
        height={SCREEN_HEIGHT * SCALE_MOD}
      ></canvas>
    </section>
  );
}
