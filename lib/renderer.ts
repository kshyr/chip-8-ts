export const SCREEN_WIDTH = 64;
export const SCREEN_HEIGHT = 32;
export const SCALE_MOD = 16;

const BG_COLOR = "#222323 ";
const FG_COLOR = "#f0f6f0";

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public frame_buffer: number[][];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.clear_screen();
        this.frame_buffer = this.frame_buffer_init();
    }

    frame_buffer_init(): number[][] {
        let frame_buffer: number[][] = [];

        for (let i = 0; i < SCREEN_HEIGHT; i++) {
            frame_buffer.push([]);
            for (let j = 0; j < SCREEN_WIDTH; j++) {
                frame_buffer[i].push(0);
            }
        }

        return frame_buffer;
    }

    draw_pixel(x: number, y: number, value: number): number {
        const collision = this.frame_buffer[y][x] & value;

        this.frame_buffer[y][x] ^= value;

        if (this.frame_buffer[y][x]) {
            this.ctx.fillStyle = FG_COLOR;
            this.ctx.fillRect(x * SCALE_MOD, y * SCALE_MOD, SCALE_MOD, SCALE_MOD);
        } else {
            this.ctx.fillStyle = BG_COLOR;
            this.ctx.fillRect(x * SCALE_MOD, y * SCALE_MOD, SCALE_MOD, SCALE_MOD);
        }

        return collision;
    }

    clear_screen(): void {
        this.ctx.fillStyle = BG_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
