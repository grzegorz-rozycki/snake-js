var PHYSICS = (function () {
    'use strict';
    var API = Object.create(null),
        snake = Object.create(null),
        movement = null,
        fruit = [];
    // public API
    API.init = function () {

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
        console.log('Step took: ' + (Date.now() - tS) + '[ms]');
    };
    API.getSnake = function () {
        return snake;
    };
    return Object.freeze(API);
} ());
