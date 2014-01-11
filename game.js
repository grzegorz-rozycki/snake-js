var GAME = (function () {
    'use strict';
    var API = Object.create(null),
        finished = null,
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
    function step() {
        PHYSICS.step();
        GRAPHICS.draw();
    }
    // public API:
    API.init = function () {
        var tS = null,
            tE = null;
        try {
            tS = Date.now();
            finished = false;
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
            tE = Date.now();
            console.log('GAME INIT TOOK: ' + (tE - tS) + '[ms]');
            //GAME.play();
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
        if (run === null && finished === false) {
            run = setInterval(step, CONF.fps);
        }
    };
    API.toggle = function () {
        if (run) {
            API.pause();
        } else {
            API.play();
        }
    };
    API.end = function () {
        finished = true;
        API.pause();
        alert('Koniec gry!\nTwój wynik:\t' + SCORE + '\nZebrałeś:\t' + COLLECTED);
    };
    return Object.freeze(API);
} ());
