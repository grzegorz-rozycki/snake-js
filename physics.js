var PHYSICS = (function () {
    'use strict';
    var API = Object.create(null),
        movement = null,
        fruit = [],
        snake = [];
    // private methods:
    function checkForColisions() {}
    function fruitCollected() {}
    function moveSnake() {
        switch (movement) {
            case 'n':
                break;
            case 's':
                break;
            case 'w':
                break;
            case 'e':
                snake = [sanke[0][0] + 1, snake[0][1]];
                break;
            default:
                throw new Error('PHYSICS: unknown movement direction: ' + movement);
        }
    }
    // public API:
    API.init = function () {
        var i = 0;
        movement = 'e';
        for (; i < CONF.initLength; i += 1) {
            snake.push(CONF.initPosition);
        }
        fruit = [10, 10];
        console.log(snake);
        console.log(fruit);
    };
    API.step = function () {
        var tS = Date.now(),
            i = 0,
            j = 0;
        for (; i < CONF.mapWidth; i += 1) {
            for (; j < CONF.mapHeight; j += 1) {
                Math.pow(Math.sin(i), j);
            }
        }
        moveSnake();
        console.log('Step took: ' + (Date.now() - tS) + '[ms]');
    };
    API.getSnake = function () {
        return snake;
    };
    API.getFruit = function () {
        return fruit;
    };
    return Object.freeze(API);
} ());
