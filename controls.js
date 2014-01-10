var CONTROLS = function () {
    'use strict';
    // private members:
    var actions = {         // posible actions in game
            "n" : false,    // move north
            "s" : false,    //      south
            "w" : false,    //      west
            "e" : false,    //      east
            "p" : false     // pause game
        },
        bindings = {},  // key boundend with actions
        listening = false;

    // public members:
    return Object.freeze({
        keyDownEventHandler: function (e) {
            var b = bindings[e.keyCode];
            if (actions.hasOwnProperty(b)) {
                actions[b] = true;
            }
        },
        keyUpEventHandler: function (e) {
            var b = bindings[e.keyCode];
            if (actions.hasOwnProperty(b)) {
                actions[b] = false;
            }
        },
        getActions: function () {
            return actions;
        },
        init: function () {
            if (CANVAS) {
                // append listeners:
                CANVAS.addEventListener("keydown", CONTROLS.keyDownEventHandler);
                CANVAS.addEventListener("keyup", CONTROLS.keyUpEventHandler);
                CANVAS.addEventListener("click", GAME.toggle);
                // standard key setup / bindings:
                CONTROLS.bindKey(65, "w");  // a key
                CONTROLS.bindKey(68, "e");  // d key
                CONTROLS.bindKey(87, "n");  // w key
                CONTROLS.bindKey(83, "s");  // s key
                CONTROLS.bindKey(37, "w");  // left-arrow
                CONTROLS.bindKey(39, "e");  // right arrow
                CONTROLS.bindKey(38, "n");  // up arrow
                CONTROLS.bindKey(40, "s");  // down arrow
                CONTROLS.bindKey(80, "p");  // p key
                CONTROLS.bindKey(40, "s");  // down arrow
                //CONTROLS.bindKey(27, "s");  // ESC key [doesn't work...]
                // everything went OK
                // tell gameManager, that i'm ready
            }
        },
        halt: function () {
            if (CANVAS) {
                // clean up!
                //canvas.removeEventListener("mousemove", controlManager.mouseMoveEventHandler);
                CANVAS.removeEventListener("keydown", CONTROLS.keyDownEventHandeler);
                CANVAS.removeEventListener("keyup", CONTROLS.keyUpEventHandler);
                // clear action queue
                for (var i in actions) {
                    if (actions.hasOwnProperty(i)) {
                        actions[i] = false;
                    }
                }
                // clear bindings
                bindings = {}; // aż tak drastycznie? nazwa mówi zatrzymaj, nie zniszcz...
            }
        },
        bindKey: function (key, action) {
            key = +key;
            action = (actions.hasOwnProperty(action)) ? action : null;
            if (action !== null) {
                bindings[key] = action;
                return true;
            } else {
                return false;
            }
        }
    });
} ();
