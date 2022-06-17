export default function Graphics() {
    this.ctx = null;
    this.tileSize = 10;
    this.mapWidth = 100;
    this.mapHeight = 100;
    this.backgroundColor = '#BDBDBD';
    this.borderColor = '#424242';
    this.fruitColor = '#FE1506';
    this.snakeColor = '#2D9424';
}

Graphics.prototype.init = function (canvasSelector) {
    this.ctx = document.querySelector(canvasSelector).getContext('2d');
};

Graphics.prototype.drawTile = function (x, y) {
    this.ctx.fillRect(
        x * this.tileSize + 1,
        y * this.tileSize + 1,
        this.tileSize - 1,
        this.tileSize - 1,
    );
};

Graphics.prototype.drawSnake = function (body) {
    this.ctx.save();
    this.ctx.fillStyle = this.snakeColor;

    for (const block of body) {
        this.drawTile(block[0], block[1]);
    }

    this.ctx.restore();
};

Graphics.prototype.drawFruit = function (fruit) {
    this.ctx.save();
    this.ctx.fillStyle = this.fruitColor;
    this.drawTile(fruit[0], fruit[1]);
    this.ctx.restore();
};

Graphics.prototype.drawMap = function () {
    this.ctx.save();
    // borders
    this.ctx.fillStyle = this.borderColor;
    this.ctx.fillRect(
        0,
        0,
        this.mapWidth * this.tileSize,
        this.mapHeight * this.tileSize,
    );
    // background
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(
        this.tileSize,
        this.tileSize,
        (this.mapWidth - 2) * this.tileSize,
        (this.mapHeight - 2) * this.tileSize,
    );
    this.ctx.restore();
};
