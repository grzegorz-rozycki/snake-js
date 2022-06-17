export default class Graphics {
    private readonly backgroundColor = '#BDBDBD';
    private readonly borderColor = '#424242';
    private readonly fruitColor = '#FE1506';
    private readonly snakeColor = '#2D9424';

    private context: CanvasRenderingContext2D;

    constructor(
        canvas: HTMLCanvasElement,
        private tileSize: number = 10,
        private mapWidth: number = 100,
        private mapHeight: number = 100,
    ) {
        const context = canvas.getContext('2d');

        if (null === context) {
            throw new Error("Couldn't get 2D rendering context from canvas element");
        }

        this.context = context;
    }

    public draw(fruit: number[], snake: number[][]) {
        this.drawMap();
        this.drawFruit(fruit);
        this.drawSnake(snake);
    }

    private drawSnake(body: number[][]) {
        this.context.save();
        this.context.fillStyle = this.snakeColor;

        for (const block of body) {
            this.drawTile(block[0], block[1]);
        }

        this.context.restore();
    }

    private drawFruit(fruit: number[]) {
        this.context.save();
        this.context.fillStyle = this.fruitColor;
        this.drawTile(fruit[0], fruit[1]);
        this.context.restore();
    }

    private drawMap() {
        this.context.save();
        // borders
        this.context.fillStyle = this.borderColor;
        this.context.fillRect(
            0,
            0,
            this.mapWidth * this.tileSize,
            this.mapHeight * this.tileSize,
        );
        // background
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(
            this.tileSize,
            this.tileSize,
            (this.mapWidth - 2) * this.tileSize,
            (this.mapHeight - 2) * this.tileSize,
        );
        this.context.restore();
    }

    private drawTile(x: number, y: number): void {
        this.context.fillRect(
            x * this.tileSize + 1,
            y * this.tileSize + 1,
            this.tileSize - 1,
            this.tileSize - 1,
        );
    }
}
