import fs from "fs";
import path from "path";

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { name },
  } = req;
  const filePath = path.resolve("./lib", "test-roms", name as string);
  const raw = Uint8Array.from(fs.readFileSync(filePath));
  res.status(200).json({ raw });
}
