function Graphics() {
    this.ctx = null;
    this.tileSize = 10;
    this.mapWidth = 100;
    this.mapHeight = 100;
    this.backgroundColor = '#BDBDBD',
    this.gameOverColor = '#000',
    this.borderColor = '#424242',
    this.fruitColor = '#FE1506',
    this.snakeColor = '#2D9424',
    this.textColor = '#FFF';
}

Graphics.prototype.init = function (canvasSelector) {
    this.ctx = document.querySelector(canvasSelector).getContext('2d');
};

Graphics.prototype.drawTile = function (x, y) {
    this.ctx.fillRect(
        x * this.tileSize + 1,
        y * this.tileSize + 1,
        this.tileSize - 1,
        this.tileSize -1
    );
};

Graphics.prototype.drawSnake = function (body) {
    var op = null,
        i = null,
        l = null;
    this.ctx.save();
    this.ctx.fillStyle = this.snakeColor;
    for (i = 0, l = body.length, op = .3 / l; i < l; i += 1) {
        this.drawTile(body[i][0], body[i][1]);
        this.ctx.globalAlpha -= op;
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
    var i = null,
        t = null;
    this.ctx.save();
    // borders
    this.ctx.fillStyle = this.borderColor;
    this.ctx.fillRect(
        0,
        0,
        this.mapWidth * this.tileSize,
        this.mapHeight * this.tileSize
    );
    // background
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(
        this.tileSize,
        this.tileSize,
        (this.mapWidth - 2) * this.tileSize,
        (this.mapHeight - 2) * this.tileSize
    );
    this.ctx.restore();
};

Graphics.prototype.drawInfo = function () {
    this.ctx.save();
    this.ctx.font = CONF.tileSize + 'px Arial';
    this.ctx.fillStyle = textColor;
    this.ctx.fillText('SCORE: ' + SCORE + 'pts.', CONF.tileSize, (CONF.tileSize - 2));
    this.ctx.fillText('FPS: ' + GAME.getFPS(), (CONF.mapWidth - 6) * CONF.tileSize, (CONF.tileSize - 2));
    this.ctx.restore();
};

//API.draw = function () {
//    var fruit = PHYSICS.getFruit();
//    drawMap();
//    drawFriut(fruit[0], fruit[1]);
//    drawSnake(PHYSICS.getSnake());
//    drawInfo();
//};
//
Graphics.prototype.write = function (text) {
    if (typeof text === "string") {
        ctx.save();
        ctx.font = (CONF.tileSize * 2) + 'px Arial';
        ctx.fillStyle = gameOverColor;
        ctx.fillText(
            text,
            Math.round((CONF.mapWidth * CONF.tileSize - ctx.measureText(text).width) / 2),
            (Math.round(CONF.mapHeight / 2 + 1 )) * CONF.tileSize
        );
        ctx.restore();
    }
};
