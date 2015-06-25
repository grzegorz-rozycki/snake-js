'use strict';
window.snake = (function () {
    var api = Object.create(null),    // public methods
        conf = Object.create(null),   // configuration object
        collected = 0,                // collected fruits count
        isInitiated = false,          // is initiated flag
        isOver = false,               // is game over flag
        level = 1,                    // current level; used to get propper timeout, score per fruit
        loop = Object.create(null),   // game loop control object; holds loop handle, last action time and timeout
        module = Object.create(null), // holds reference to graphics, physics and controls modules
        score = 0;                    // current score

    conf.canvasSelector = '#canvas'; // id of canvas element to draw to
    conf.tileSize = 20;              // size of tile in pixels
    conf.mapHeight = 20;             // game map height in tiles; pixels = tileSize * mapHeight
    conf.mapWidth = 40;              // game map width in tiles; pixels = tileSize * mapWidth
    conf.initLength = 3;             // initial length of the snake in tiles
    // position to place snake at the begining; in tiles
    conf.initPosition = [Math.floor(conf.mapWidth / 2), Math.floor(conf.mapHeight / 2)];
    conf.pointMap = [1, 2, 5, 10, 15, 25];
    conf.speedMap = [250, 200, 150, 100, 50, 0];
    conf.levelMap = [1, 2, 5, 10, 500];

    module.controls = Controls.createDefualts();
    module.graphics = new Graphics();
    module.physics = new Physics(conf.mapWidth, conf.mapHeight);


    function collisionHandler() {
        isOver = true;
        module.graphics.isPulsing = true;
        console.log('game over man! you scored ' + score + ' pts.');
    }

    function collectionHandler() {
        collected += 1;
        score += conf.pointMap[level];

        // can increment level?
        if ((conf.levelMap.length - 1) > level) {

            if (collected >= conf.levelMap[level]) {
                level += 1;
                loop.timeout = conf.speedMap[level];
                console.log('level up!');
            }
        }
        
    }
    /**
     *
     */
    function step() {
        var now = Date.now();
        
        if (now - loop.lastAction >= loop.timeout) {
            loop.lastAction = now;
            module.physics.step(module.controls.getNextAction());
        }
        module.graphics.drawMap();
        module.graphics.drawFruit(module.physics.fruit);
        module.graphics.drawSnake(module.physics.snake);
        loop.frameRequest = window.requestAnimationFrame(step);
    }

    api.init = function () {
        var handler;

        if (!isInitiated) {
            // loop configuration
            loop.frameRequest = null;
            loop.lastAction = 0;
            loop.timeout = conf.speedMap[level];
            // ESC key action handler
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
            // key event listeners
            document.addEventListener("keyup", module.controls.keyUp.bind(module.controls));

            // physics
            module.physics.init(conf.initLength, conf.initPosition);

            // graphics
            module.graphics.tileSize = conf.tileSize;
            module.graphics.mapWidth = conf.mapWidth;
            module.graphics.mapHeight = conf.mapHeight;
            module.graphics.init(conf.canvasSelector);

            // bind phisics observers
            module.physics.addHandler(Physics.COLLISION_EVENT, collisionHandler);
            module.physics.addHandler(Physics.COLLECTION_EVENT, collectionHandler);
            isInitiated = true;
        }
    };

    api.start = function () {
        if (!isOver && !loop.frameRequest) {
            loop.frameRequest = window.requestAnimationFrame(step);
        }
    };

    api.stop = function () {
        if (loop.frameRequest) {
            window.cancelAnimationFrame(loop.frameRequest);
            loop.frameRequest = null;
        }
    };

    api.isRunning = function () {
        return (loop.frameRequest !== null);
    };

    return Object.freeze(api);
} ());
