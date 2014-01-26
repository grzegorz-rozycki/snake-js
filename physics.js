var PHYSICS = (function () {
    'use strict';
    var API = Object.create(null),
        movement = null,
        fruit = null,
        snake = null;
    // private methods:
    function checkForColisions() {
        var l = (snake.length - 1),
            i = 1;
        // border collision
        if (
            snake[0][0] <= 0 ||
            snake[0][1] <= 0 ||
            snake[0][0] >= (CONF.mapWidth - 1) ||
            snake[0][1] >= (CONF.mapHeight - 1)
        ) {
            return true;
        }
        // self collision
        for (; i < l; i += 1) {
            if (
                (snake[0][0] === snake[i][0]) &&
                (snake[0][1] === snake[i][1])
            ) {
                return true;
            }
        }
        return false
    }
    function fruitCollected() {
        return (fruit[0] === snake[0][0] && fruit[1] === snake[0][1]);
    }
    function getDirection() {
        var act = CONTROLS.getActions();
        if (act.n && movement !== 's') {
            return 'n';
        }
        if (act.e && movement !== 'w') {
            return 'e';
        }
        if (act.s && movement !== 'n') {
            return 's';
        }
        if (act.w && movement !== 'e') {
            return 'w';
        }
        return movement;
    }
    function moveSnake() {
        var i = (snake.length - 1);
        movement = getDirection();
        for (; i > 0; i -= 1) {
            snake[i][0] = snake[i - 1][0];
            snake[i][1] = snake[i - 1][1];
        }
        switch (movement) {
            case 'n':
                snake[0][1] -= 1;
                break;
            case 's':
                snake[0][1] += 1;
                break;
            case 'w':
                snake[0][0] -= 1;
                break;
            case 'e':
                snake[0][0] += 1;
                break;
            default:
                throw new Error('PHYSICS: unknown movement direction: ' + movement);
        }
    }
    function moveFruit() {
        var x = Math.round(Math.random() * (CONF.mapWidth - 3) + 1),
            y = Math.round(Math.random() * (CONF.mapHeight - 3) + 1),
            clean = true,
            li = null,
            lj = null,
            ls = null,
            s = null,
            i = null,
            j = null;
        // check if random position is outsiede of snake body
        for (s = 0, ls = snake.length; s < ls; s += 1) {
            if ((x === snake[s][0]) && (y === snake[s][1])) {
                clean = false;
                break;
            }
        }
        // random point din't fit outside snake body
        // search for empty point, starting from x, y
        if (clean !== true) {
            for (i = 1, li = (CONF.mapHeight - 1); i < li; i += 1) {
                for (j = 1, lj = (CONF.mapWidth - 1); j < lj; j += 1) {
                    x = ((x + j) % (CONF.mapWidth - 2) + 1);    // whoa, nice :)
                    y = ((y + i) % (CONF.mapHeight - 2) + 1);    // whoa, nice :)
                    clean = true;
                    for (s = 0; s < ls; s += 1) {
                        if ((x === snake[s][0]) && (y === snake[s][1])) {
                            clean = false;
                            break;
                        }
                    }
                    if (clean) {
                        fruit[0] = x;
                        fruit[1] = y;
                        return ;
                    }
                }
            }
        } else {
            fruit[0] = x;
            fruit[1] = y;
        }
    }
    // public API:
    API.init = function () {
        var i = 0;
        movement = 'e';
        fruit = [];
        snake = [];
        for (; i < CONF.initLength; i += 1) {
            snake.push([CONF.initPosition[0] - i, CONF.initPosition[1]]);
            //snake.push(CONF.initPosition); // this pushes the reference
            //snake.push(Object.create(CONF.initPosition)); // this clones the object
        }
        moveFruit();
    };
    API.step = function () {
        var tail = snake.length - 1;
        moveSnake();
        if (fruitCollected()) {
            snake.push([snake[tail][0], snake[tail][1]]);
            SCORE += CONF.ppf;
            COLLECTED += 1;
            moveFruit();
        }
        if (checkForColisions()) {
            //GAME.end();
            return false;
        } else {
            return true;
        }
    };
    API.getSnake = function () {
        return snake;
    };
    API.getFruit = function () {
        return fruit;
    };
    return Object.freeze(API);
} ());
