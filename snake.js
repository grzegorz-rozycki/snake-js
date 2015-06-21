'use strict';
snake = (function () {
    var api =  Object.create(null),
        conf = Object.create(null),
        module = Object.create(null),
        loop,
        score;

    conf.canvasName = 'canvas';     // id of canvas element to draw to
    conf.tileSize = 20;             // size of tile in pixels
    conf.mapHeight = 20;            // game map height in tiles; pixels = tileSize * mapHeight
    conf.mapWidth = 40;             // game map width in tiles; pixels = tileSize * mapWidth
    conf.initLength = 3;            // initial length of the snake in tiles
    // position to place snake at the begining; in tiles
    conf.initPosition = [Math.floor(conf.mapWidth / 2), Math.floor(conf.mapHeight / 2)];
    conf.ppf = 5;                   // points per fruit collected by snake
    conf.speed = {current: 0, map: [250, 200, 150, 100, 50]};

    module.controls = new Controls();
    module.graphics = new Graphics();
    module.physics = new Physics();

    api.init = function () {};

    api.start = function () {};
    
    api.stop = function () {};

    return Object.freeze(api);
} ());