import fs from "fs";
import path from "path";

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ files: fs.readdirSync("./lib/test-roms") });
}
