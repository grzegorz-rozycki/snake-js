'use strict';
window.snake = (function () {
    var api = Object.create(null),    // public methods
        conf = Object.create(null),   // configuration object
        collected = 0,                // collected fruits count
        domElement = Object.create(null),
        isInitiated = false,          // is initiated flag
        isOver = false,               // is game over flag
        level = 0,                    // current level; used to get propper timeout, score per fruit
        loop = Object.create(null),   // game loop control object; holds loop handle, last action time and timeout
        module = Object.create(null), // holds reference to graphics, physics and controls modules
        score = 0;                    // current score

    conf.selector = Object.create(null);
    conf.selector.canvas = '#canvas';// id of canvas element to draw to
    conf.selector.score = '#score';  // id of score label
    conf.selector.level = '#level';  // id of level label
    conf.selector.status = '#status';// id of status label
    conf.tileSize = 20;              // size of tile in pixels; this will be recalculated on init
    conf.mapHeight = 20;             // game map height in tiles; pixels = tileSize * mapHeight
    conf.mapWidth = 40;              // game map width in tiles; pixels = tileSize * mapWidth
    conf.initLength = 3;             // initial length of the snake in tiles
    // position to place snake at the begining; in tiles
    conf.initPosition = [Math.floor(conf.mapWidth / 2), Math.floor(conf.mapHeight / 2)];
    conf.pointMap = [5, 7, 9, 12, 15, 20];     // points gained per fruit at each level
    conf.speedMap = [200, 150, 100, 75, 50, 0];// movement timeout at each level
    conf.levelMap = [10, 20, 50, 100, 250];    // one less than in point and speed maps! when to shange to higher level

    module.controls = Controls.createDefualts();
    module.graphics = new Graphics();
    module.physics = new Physics(conf.mapWidth, conf.mapHeight);


    function collisionHandler() {
        isOver = true;
        module.graphics.isPulsing = true;
        writeToElement('status', 'Game over');
    }

    function collectionHandler() {
        collected += 1;
        score += conf.pointMap[level];
        writeToElement('score', score);

        // can increment level?
        if ((conf.levelMap.length - 1) > level) {

            if (collected >= conf.levelMap[level]) {
                level += 1;
                loop.timeout = conf.speedMap[level];
                writeToElement('level', level + 1);
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

    function keyUpHandler(evt) {
        if (module.controls.hasBinding(evt.keyCode)) {
            module.controls.keyUp(evt);
            evt.stopPropagation();
            evt.preventDefault();
        }
    }
    
    function keyDownHandler(evt) {
        if (module.controls.hasBinding(evt.keyCode)) {
            evt.stopPropagation();
            evt.preventDefault();
        }
    }

    function writeToElement(element, text) {
        if (element in domElement) {
            domElement[element].textContent = text;
        }
    }

    api.init = function () {
        var canvas,
            handler;

        if (!isInitiated) {
            // determine tile size in pixels
            canvas = document.querySelector(conf.selector.canvas);
            conf.tileSize = Math.min(Math.round(canvas.width / conf.mapWidth),
                    (Math.round(canvas.height / conf.mapHeight)));
            // get needed DOM element reference
            domElement.score = document.querySelector(conf.selector.score);
            domElement.level = document.querySelector(conf.selector.level);
            domElement.status = document.querySelector(conf.selector.status);
            // loop configuration
            loop.frameRequest = null;
            loop.lastAction = 0;
            loop.timeout = conf.speedMap[level];
            // ESC key action handler
            handler = new Controls.Handler();
            handler.action = api.toggle;
            handler.on = "up";
            module.controls.bindings["27"] = handler;
            // key event listeners
            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);

            // physics
            module.physics.init(conf.initLength, conf.initPosition);

            // graphics
            module.graphics.tileSize = conf.tileSize;
            module.graphics.mapWidth = conf.mapWidth;
            module.graphics.mapHeight = conf.mapHeight;
            module.graphics.init(conf.selector.canvas);

            // bind phisics observers
            module.physics.addHandler(Physics.COLLISION_EVENT, collisionHandler);
            module.physics.addHandler(Physics.COLLECTION_EVENT, collectionHandler);
            // write initial score and level values
            writeToElement('score', score);
            writeToElement('level', level + 1);
            isInitiated = true;
        }
    };

    api.start = function () {
        if (!isOver && !loop.frameRequest) {
            loop.frameRequest = window.requestAnimationFrame(step);
            writeToElement('status', 'Game running');
        }
    };

    api.stop = function () {
        if (loop.frameRequest) {
            window.cancelAnimationFrame(loop.frameRequest);
            loop.frameRequest = null;
            writeToElement('status', 'Game paused');
        }
    };

    api.toggle = function () {
        if (api.isRunning()) {
            api.stop();
        } else {
            api.start();
        }
    };

    api.isRunning = function () {
        return (loop.frameRequest !== null);
    };

    return Object.freeze(api);
} ());
