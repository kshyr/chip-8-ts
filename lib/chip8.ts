import { Renderer, SCREEN_HEIGHT, SCREEN_WIDTH } from "./renderer";

const FONTSET = [
    new Uint8Array([0xf0, 0x90, 0x90, 0x90, 0xf0]), // 0
    new Uint8Array([0x20, 0x60, 0x20, 0x20, 0x70]), // 1
    new Uint8Array([0xf0, 0x10, 0xf0, 0x80, 0xf0]), // 2
    new Uint8Array([0xf0, 0x10, 0xf0, 0x10, 0xf0]), // 3
    new Uint8Array([0x90, 0x90, 0xf0, 0x10, 0x10]), // 4
    new Uint8Array([0xf0, 0x80, 0xf0, 0x10, 0xf0]), // 5
    new Uint8Array([0xf0, 0x80, 0xf0, 0x90, 0xf0]), // 6
    new Uint8Array([0xf0, 0x10, 0x20, 0x40, 0x40]), // 7
    new Uint8Array([0xf0, 0x90, 0xf0, 0x90, 0xf0]), // 8
    new Uint8Array([0xf0, 0x90, 0xf0, 0x10, 0xf0]), // 9
    new Uint8Array([0xf0, 0x90, 0xf0, 0x90, 0x90]), // A
    new Uint8Array([0xe0, 0x90, 0xe0, 0x90, 0xe0]), // B
    new Uint8Array([0xf0, 0x80, 0x80, 0x80, 0xf0]), // C
    new Uint8Array([0xe0, 0x90, 0x90, 0x90, 0xe0]), // D
    new Uint8Array([0xf0, 0x80, 0xf0, 0x80, 0xf0]), // E
    new Uint8Array([0xf0, 0x80, 0xf0, 0x80, 0x80]), // F
];

const RAM_SIZE = 4096;
const STACK_SIZE = 16;
const REGS_NUM = 16;
const START_ADDR = 0x200;

export class CHIP8 {
    private RAM: Uint16Array;
    private V: Uint8Array;
    private stack: Uint16Array;
    private PC: number;
    private I: number;
    private SP: number;
    private ST: number;
    private DT: number;
    private display: Renderer;

    constructor(canvas: HTMLCanvasElement) {
        this.RAM = new Uint16Array(RAM_SIZE);
        this.V = new Uint8Array(REGS_NUM);
        this.stack = new Uint16Array(STACK_SIZE);
        this.PC = START_ADDR;
        this.I = 0;
        this.SP = -1;
        this.ST = 0;
        this.DT = 0;
        this.display = new Renderer(canvas);
    }

    load_rom(rom: number[]) {
        for (let offset = 0; offset < rom.length; offset++) {
            this.RAM[START_ADDR + offset] = rom[offset];
        }
        console.log("Loaded into RAM: ", this.RAM);
    }

    tick(): void {
        const op = this.fetch();
        this.execute(op);
    }

    fetch(): number {
        const higher_byte = this.RAM[this.PC];
        const lower_byte = this.RAM[this.PC + 1];

        const op = (higher_byte << 8) | lower_byte;
        this.PC += 2;

        return op;
    }

    execute(op: number): void {
        const x = (op >> 8) & 0x000f;
        const y = (op >> 4) & 0x000f;
        const n = op & 0x000f;
        const kk = op & 0x00ff;
        const nnn = op & 0x0fff;

        switch (op & 0xf000) {
            case 0x0000:
                switch (kk) {
                    // CLS
                    case 0x00e0:
                        console.info("Clear screen");
                        this.display.clear_screen();
                        break;

                    // RET
                    case 0x00ee:
                        this.SP--;
                        this.PC = this.stack[this.SP];
                        break;

                    default:
                        console.warn(
                            `Unimplemented opcode: ${op
                                .toString(16)
                                .padStart(4, "0")
                                .toUpperCase()}`
                        );
                        break;
                }
                break;

            // JP
            case 0x1000:
                console.info("Jump to address nnn");
                this.PC = nnn;
                break;

            // CALL
            case 0x2000:
                this.stack[this.SP] = this.PC + 2;
                this.SP++;
                this.PC = nnn;
                break;

            // SE Vx = kk
            case 0x3000:
                if (this.V[x] === kk) this.PC += 2;
                break;

            // SNE
            case 0x4000:
                if (this.V[x] !== kk) this.PC += 2;
                break;

            // SE Vx = kk
            case 0x5000:
                if (this.V[x] === this.V[y]) this.PC += 2;
                break;

            // LD Vx <- kk
            case 0x6000:
                this.V[x] = kk;
                break;

            // ADD Vx + kk
            case 0x7000:
                this.V[x] += kk;
                break;

            case 0x8000:
                switch (n) {
                    // LD Vx <- Vy
                    case 0x0:
                        this.V[x] = this.V[y];
                        break;

                    // OR
                    case 0x1:
                        this.V[x] |= this.V[y];
                        break;

                    // AND
                    case 0x2:
                        this.V[x] &= this.V[y];
                        break;

                    // XOR
                    case 0x3:
                        this.V[x] ^= this.V[y];
                        break;

                    // ADD Vx + Vy
                    case 0x4:
                        const carry = this.V[x] + this.V[y] > 0xff ? 1 : 0;
                        this.V[0xf] = carry;
                        this.V[x] = (this.V[x] + this.V[y]) & 0xff;
                        break;

                    // SUB Vx - Vy
                    case 0x5:
                        const borrow = this.V[x] > this.V[y] ? 1 : 0;
                        this.V[0xf] = borrow;
                        this.V[x] -= this.V[y];
                        break;

                    // SHR
                    case 0x6:
                        this.V[0xf] = this.V[x] & 0x1;
                        this.V[x] >>= 1;
                        break;

                    // SUBN
                    case 0x7:
                        {
                            const borrow = this.V[y] > this.V[x] ? 1 : 0;
                            this.V[0xf] = borrow;
                            this.V[x] = this.V[y] - this.V[x];
                        }
                        break;

                    // SHL
                    case 0xe:
                        this.V[0xf] = (this.V[x] >> 7) & 0x1;
                        this.V[x] <<= 1;
                        break;

                    default:
                        console.warn(
                            `Unimplemented opcode: ${op
                                .toString(16)
                                .padStart(4, "0")
                                .toUpperCase()}`
                        );
                        break;
                }
                break;

            // SNE Vx, Vy
            case 0x9000:
                if (this.V[x] !== this.V[y]) this.PC += 2;
                break;

            // LD I
            case 0xa000:
                this.I = nnn;
                break;

            // JP V0
            case 0xb000:
                this.PC = this.V[0] + nnn;

            case 0xc000:
                const rng = crypto.getRandomValues(new Uint16Array(1))[0];
                this.V[x] = rng & kk;

            case 0xd000:
                this.V[0xf] = 0;

                for (let i = 0; i < n; i++) {
                    let line = this.RAM[this.I + i];
                    for (let j = 0; j < 8; j++) {
                        let value = line & (1 << (7 - j)) ? 1 : 0;

                        let x_coord = (this.V[x] + j) % SCREEN_WIDTH;
                        let y_coord = (this.V[y] + i) % SCREEN_HEIGHT;

                        if (this.display.draw_pixel(x_coord, y_coord, value)) {
                            this.V[0xf] = 1;
                        }
                    }
                }

            default:
                console.warn(
                    `Unimplemented opcode: ${op
                        .toString(16)
                        .padStart(4, "0")
                        .toUpperCase()}`
                );
                break;
        }
    }
}
