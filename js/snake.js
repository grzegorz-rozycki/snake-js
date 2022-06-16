'use strict';
window.snake = (function () {
    let api = Object.create(null),    // public methods
        conf = Object.create(null),   // configuration object
        collected = 0,                // collected fruits count
        domElement = Object.create(null),
        isInitiated = false,          // is initiated flag
        isOver = false,               // is game over flag
        level = 0,                    // current level; used to get proper timeout, score per fruit
        loop = Object.create(null),   // game loop control object; holds loop handle, last action time and timeout
        module = Object.create(null), // holds reference to graphics, physics and controls modules
        score = 0                    // current score

    conf.selector = Object.create(null);
    conf.selector.canvas = '#canvas';// id of canvas element to draw to
    conf.selector.score = '#score';  // id of score label
    conf.selector.level = '#level';  // id of level label
    conf.selector.menu = '#menu-modal';
    conf.selector.curtain = '.curtain';
    conf.tileSize = 20;              // size of tile in pixels; this will be recalculated on init
    conf.mapHeight = 20;             // game map height in tiles; pixels = tileSize * mapHeight
    conf.mapWidth = 40;              // game map width in tiles; pixels = tileSize * mapWidth
    conf.initLength = 3;             // initial length of the snake in tiles

    // position to place snake at the beginning; in tiles
    conf.initPosition = [Math.floor(conf.mapWidth / 2), Math.floor(conf.mapHeight / 2)];
    conf.pointMap = [1, 2, 5, 10, 15, 25];
    conf.speedMap = [150, 140, 130, 120, 110, 100];
    conf.levelMap = [1, 2, 5, 10, 500];

    module.controls = Controls.createDefaults();
    module.graphics = new Graphics();
    module.physics = new Physics(conf.mapWidth, conf.mapHeight);


    function collisionHandler() {
        isOver = true;
        domElement.curtain.classList.remove('hidden');
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

    function escHandler() {
        if (isOver) {
            api.restart();
        } else {
            api.toggle();
        }
    }

    function step() {
        if (Date.now() - loop.lastAction >= loop.timeout) {
            let actionsPerformed = 0;

            // Do at least one physics step; but if there are more actions perform them immediately.
            // This results in a smoother experience with the controls.
            // Limit the amount of actions performed within a single loop step to 3 (it's unrealistic to hit this limit).
            // Purge the actions list after this step, as we don't need the older actions to stack up.
            do {
                module.physics.step(module.controls.getNextAction());
                actionsPerformed += 1;
            } while (module.controls.hasNextAction() && actionsPerformed < 3);

            module.controls.purgeActions();
            loop.lastAction = Date.now();
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

    function setupLevel() {
        isOver = false;
        level = 0;
        score = 0;

        loop.frameRequest = null;
        loop.lastAction = 0;
        loop.timeout = conf.speedMap[level];
    }

    api.init = function () {
        let canvas,
            handler;

        if (isInitiated) {
            return;
        }

        // determine tile size in pixels
        canvas = document.querySelector(conf.selector.canvas);
        conf.tileSize = Math.min(Math.round(canvas.width / conf.mapWidth),
            (Math.round(canvas.height / conf.mapHeight)));
        // get needed DOM element reference
        domElement.curtain = document.querySelector(conf.selector.curtain);
        domElement.score = document.querySelector(conf.selector.score);
        domElement.level = document.querySelector(conf.selector.level);
        // ESC key action handler
        handler = new Controls.Handler();
        handler.action = escHandler;
        handler.on = 'up';
        module.controls.bindings['27'] = handler;
        // key event listeners
        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);

        // physics
        module.physics.init(conf.initLength, conf.initPosition);

        // graphics
        module.graphics.tileSize = conf.tileSize;
        module.graphics.mapWidth = conf.mapWidth;
        module.graphics.mapHeight = conf.mapHeight;
        module.graphics.init(conf.selector.canvas);

        // bind physics observers
        module.physics.addHandler(Physics.COLLISION_EVENT, collisionHandler);
        module.physics.addHandler(Physics.COLLECTION_EVENT, collectionHandler);

        setupLevel();

        isInitiated = true;
    };

    api.start = function () {
        if (api.isRunning()) {
            return;
        }

        loop.frameRequest = window.requestAnimationFrame(step);
        writeToElement('score', score);
        writeToElement('level', level + 1);
    };

    api.stop = function () {
        if (!api.isRunning()) {
            return;
        }

        window.cancelAnimationFrame(loop.frameRequest);
        loop.frameRequest = null;
    };

    api.isRunning = function () {
        return (loop.frameRequest !== null);
    };

    api.toggle = function () {
        if (api.isRunning()) {
            api.stop();
        } else {
            api.start();
        }
    };

    api.restart = function () {
        isOver = false;
        loop.frameRequest = null;
        module.physics.init(conf.initLength, conf.initPosition);
        domElement.curtain.classList.add('hidden');
        setupLevel();
        api.start();
    };

    return Object.freeze(api);
}());
