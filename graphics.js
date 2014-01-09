var GRAPHICS = (function () {
    'use strict';
    // private:
    var API = Object.create(null),
        //canvasW = null, meybe to automatically determine the tile size
        //canvasH = null,
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
            x * CONF.tileSize,
            y * CONF.tileSize,
            CONF.tileSize,
            CONF.tileSize
        );
    }
    function drawSnake(body) {
        var i = null,
            l = null;
        ctx.save();
        ctx.fillStyle = '#2D9424';
        for (i = 0, l = body.length; i < l; i += 1) {
            drawTile(body[i][0], body[i][1]);
        }
        ctx.restore();
    }
    function drawFriut(x, y) {
        ctx.save();
        ctx.fillStyle = '#FE1506';
        drawTile(x, y);
        ctx.restore();
    }
    function drawMap() {
        var i = null,
            t = null;
        ctx.save();
        // borders
        ctx.fillStyle = '#424242';
        ctx.fillRect(
            0,
            0,
            CONF.mapWidth * CONF.tileSize,
            CONF.mapHeight * CONF.tileSize
        );
        // background
        ctx.fillStyle = '#BDBDBD';
        ctx.fillRect(
            CONF.tileSize,
            CONF.tileSize,
            (CONF.mapWidth - 2) * CONF.tileSize,
            (CONF.mapHeight - 2) * CONF.tileSize
        );
        ctx.restore();
    }
    // constructor: check if variable CONF is defined as an object
    if (typeof CONF !== "object") {
        throw new TypeError('GRAPHICS: CONF must be defined as an object');
    }
    // add public methods
    API.init = function () {
        var ans;
        if (CANVAS) {
            ctx = CANVAS.getContext('2d');
        } else {
            throw new Error('GRAPHICS.init: no element with id=' + CONF.canvasName);
        }
    };
    API.draw = function () {
        var body = [
            // L spahed snake body
            [3, 3],
            [3, 4],
            [4, 4],
            [5, 4]
        ];
        drawMap();
        drawFriut(8, 5);
        drawSnake(body);
    };

    // freeze [if possible] and make the API public:
    return Object.freeze(API);
} ());
