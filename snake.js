'use strict';
window.snake = (function () {
    var api =  Object.create(null),
        conf = Object.create(null),
        isInitiated = false,
        loop = null,
        module = Object.create(null),
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

    module.controls = Controls.createDefualts();
//    module.graphics = new Graphics();
//    module.physics = new Physics();

    function step() {
        console.log(module.controls.actions);
        loop = window.requestAnimationFrame(step);
    }

    api.init = function () {
        var handler;

        if (!isInitiated) {
            handler = new Controls.Handler();
            handler.action = function () {
                if (api.isRunning()) {
                    api.stop();
                } else {
                    api.start();
                }
            };

            handler.on = "up";
            module.controls.bindings["27"] = handler;
            window.addEventListener("keydown", module.controls.keyDown.bind(module.controls));
            window.addEventListener("keyup", module.controls.keyUp.bind(module.controls));
            isInitiated = true;
        }
    };

    api.start = function () {
        if (!loop) {
            loop = window.requestAnimationFrame(step);
        }
    };

    api.stop = function () {
        if (loop) {
            window.cancelAnimationFrame(loop);
            loop = null;
        }
    };

    api.isRunning = function () {
        return (loop !== null);
    };

    return Object.freeze(api);
} ());
