var GAME = (function () {
    'use strict';
    var API = Object.create(null),
        calibrationFrame = null,
        finished = null,
        fps = null,
        run = null;
    // contructor
    // check if all modules are available:
    if (
        typeof GRAPHICS !== "object" ||
        typeof CONTROLS !== "object" ||
        typeof PHYSICS !== "object" ||
        typeof CONF !== "object"
    ) {
        throw new Error('GAME: missing one of modules/objects [GRAPHICS, CONTROLS, PHYSICS, CONF]');
    }
    // private functions:
    function step(timestamp) {
        if (finished != true) {
            fps = Math.round(timestamp - calibrationFrame);
            if ((CONF.fps - fps) < 0) {
                calibrationFrame = timestamp;
                if (PHYSICS.step()) {
                    GRAPHICS.draw();
                } else {
                    // game ended
                    finished = true;
                    API.pause();
                    GRAPHICS.gameOver();
                }
            }
            requestAnimationFrame(step);
        }
    }
    // public API:
    API.init = function () {
        var tS = null,
            tE = null;
        try {
            tS = Date.now();
            finished = false;
            run = null;
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
            COLLECTED = 0;
            SCORE = 0;
            // give focus before adding event listener
            CANVAS.focus();
            CANVAS.addEventListener('blur', function () {
                GAME.pause();
            });
            CANVAS.addEventListener('focus', function () {
                GAME.play();
            });
            GAME.play();
            tE = Date.now();
            console.log('GAME INIT TOOK: ' + (tE - tS) + '[ms]');
        } catch (error) {
            console.error(error.name + ': ' + error.message);
        }
    },
    API.pause = function () {
        if (run !== null) {
            //clearInterval(run);
            cancelAnimationFrame(run);
            run = null;
        }
    };
    API.play = function () {
        if (run === null && finished === false) {
            //run = setInterval(step, CONF.fps);
            calibrationFrame = 0;
            //deltaFrames = 0; // or a high value to force immidiete drawing of first frame
            run = requestAnimationFrame(step);
        }
    };
    API.toggle = function () {
        if (run) {
            API.pause();
        } else {
            API.play();
        }
    };
    API.getFPS = function () {
        return Math.round((1000 / fps) * 100) / 100;    // Math.round
    };
    return Object.freeze(API);
} ());
