var GAME = (function () {
    'use strict';
    var API = Object.create(null),
        run = null,
        tS = null,
        tE = null;
    // contructor
    // check if all modules are available:
    if (
        typeof GRAPHICS !== "object" ||
        typeof CONTROLS !== "object" ||
        typeof PHYSICS !== "object" ||
        typeof CONF !== "object"
    ) {
        //console.log(typeof GRAPHICS, typeof CONTROLS, typeof PHYSICS , typeof CONF);
        throw new Error('GAME: missing one of modules/objects [GRAPHICS, CONTROLS, PHYSICS, CONF]');
    }
    // private functions:
    function step() {
        PHYSICS.step();
    }
    // public API:
    API.init = function () {
        try {
            tS = Date.now();
            CANVAS = document.getElementById(CONF.canvasName);
            // check if canvas element is correct:
            if (!(CANVAS instanceof HTMLCanvasElement)) {
                throw new TypeError(
                    'GAME: CONF.canvasName ['
                     + CONF.canvasName
                     + '] must be an id of a canvas element.'
                 );
            }
            GRAPHICS.init();
            CONTROLS.init();
            PHYSICS.init();
            GRAPHICS.draw();
            CANVAS.addEventListener('blur', function () {
                //console.log('CANVAS lost focus');
            });
            CANVAS.addEventListener('focus', function () {
                //console.log('CANVAS gained focus');
            });
            //CANVAS.focus();
            tE = Date.now();
            console.log('GAME INIT TOOK: ' + (tE - tS) + '[ms]');
            GAME.play();
        } catch (error) {
            console.error(error.name + ': ' + error.message);
        }
    },
    API.pause = function () {
        if (run !== null) {
            clearInterval(run);
            run = null;
        }
    };
    API.play = function () {
        if (run === null) {
            run = setInterval(step, CONF.fps);
        }
    };
    API.toggle = function () {
        if (run) {
            API.pause();
        } else {
            API.play();
        }
    }
    //API.end = function () {};
    return Object.freeze(API);
} ());
