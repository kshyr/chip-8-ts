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

export const SCREEN_WIDTH = 64;
export const SCREEN_HEIGHT = 32;

export class CHIP8 {
    private RAM: Uint16Array;
    private registers: Uint8Array;
    private stack: Uint16Array;
    private PC: number;
    private I: number;
    private SP: number;
    private ST: number;
    private DT: number;

    constructor() {
        this.RAM = new Uint16Array(RAM_SIZE);
        this.registers = new Uint8Array(REGS_NUM);
        this.stack = new Uint16Array(STACK_SIZE);
        this.PC = START_ADDR;
        this.I = 0;
        this.SP = -1;
        this.ST = 0;
        this.DT = 0;
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
        switch (op) {
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
