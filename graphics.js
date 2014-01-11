var GRAPHICS = (function () {
    'use strict';
    // private:
    var API = Object.create(null),
        backgroundColor = '#BDBDBD',
        borderColor = '#424242',
        fruitColor = '#FE1506',
        snakeColor = '#2D9424',
        ctx = null;

    // helper functions
    function toRadians(deg) {
        return (Math.PI / 180) * deg;
    }
    function toDegrees(rad) {
        return (180 * rad) / Math.PI;
    }
    function drawTile(x, y) {
        ctx.fillRect(
            x * CONF.tileSize + 1,
            y * CONF.tileSize + 1,
            CONF.tileSize - 1,
            CONF.tileSize -1
        );
    }
    function drawSnake(body) {
        var i = null,
            l = null;
        ctx.save();
        ctx.fillStyle = snakeColor;
        for (i = 0, l = body.length; i < l; i += 1) {
            drawTile(body[i][0], body[i][1]);
        }
        ctx.restore();
    }
    function drawFriut(x, y) {
        ctx.save();
        ctx.fillStyle = fruitColor;
        drawTile(x, y);
        ctx.restore();
    }
    function drawMap() {
        var i = null,
            t = null;
        ctx.save();
        // borders
        ctx.fillStyle = borderColor;
        ctx.fillRect(
            0,
            0,
            CONF.mapWidth * CONF.tileSize,
            CONF.mapHeight * CONF.tileSize
        );
        // background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(
            CONF.tileSize,
            CONF.tileSize,
            (CONF.mapWidth - 2) * CONF.tileSize,
            (CONF.mapHeight - 2) * CONF.tileSize
        );
        ctx.restore();
    }
    // add public methods
    API.init = function () {
        if (CANVAS) {
            ctx = CANVAS.getContext('2d');
        } else {
            throw new Error('GRAPHICS.init: no element with id=' + CONF.canvasName);
        }
    };
    API.draw = function () {
        var fruit = PHYSICS.getFruit();
        drawMap();
        drawFriut(fruit[0], fruit[1]);
        drawSnake(PHYSICS.getSnake());
    };

    // freeze [if possible] and make the API public:
    return Object.freeze(API);
} ());
