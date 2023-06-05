import "./style.css";
import { CHIP8 } from "./chip8";

const canvas = document.getElementById("chip8") as HTMLCanvasElement;
canvas.style.border = "1px solid white";
const chip8 = new CHIP8();

let xhr = new XMLHttpRequest();
xhr.open("GET", "src/test-roms/test.ch8", true);
xhr.responseType = "arraybuffer";
console.log(xhr.response);
// chip8.read_rom(test);
