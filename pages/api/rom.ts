import fs from "fs";
import path from "path";

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { name },
  } = req;
  const filePath = path.resolve("./lib", "test-roms", name as string);
  const file = Uint8Array.from(fs.readFileSync(filePath));
  const raw = new Uint16Array(file.length / 2);
  let ptr = 0;
  for (let i = 0; i < file.length; i += 2) {
    raw[ptr] = (file[i] << 8) | file[i + 1];
    ptr++;
  }
  res.status(200).json({ raw });
}
