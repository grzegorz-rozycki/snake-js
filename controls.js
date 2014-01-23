var CONTROLS = function () {
    'use strict';
    // private members:
    var functionBindings = null,
        actionBindings = null,  // key boundend with actions
        functions = null, // functions e.g. pause/resume
        actions = null;   // posible actions in game

    // public members:
    return Object.freeze({
        functionKeyHandler: function (e) {
            var b = functionBindings[e.keyCode];
            if (functions.hasOwnProperty(b)) {
                if (typeof functions[b] === 'function') {
                    functions[b]();
                    e.stopPropagation();
                }
            }
        },
        keyDownEventHandler: function (e) {
            var b = actionBindings[e.keyCode];
            if (actions.hasOwnProperty(b)) {
                actions[b] = true;
                e.stopPropagation();
            }
        },
        keyUpEventHandler: function (e) {
            var b = actionBindings[e.keyCode];
            if (actions.hasOwnProperty(b)) {
                actions[b] = false;
                e.stopPropagation();
            }
        },
        getActions: function () {
            return actions;
        },
        init: function () {
            if (CANVAS) {
                functionBindings = {};
                actionBindings = {};
                functions = {
                    "pause": GAME.toggle    // action name: action handler
                };
                actions = {
                    "n" : false,    // move north
                    "s" : false,    //      south
                    "w" : false,    //      west
                    "e" : false,    //      east
                    "p" : false     // pause game
                };
                // append listeners:
                CANVAS.addEventListener("keydown", CONTROLS.keyDownEventHandler);
                CANVAS.addEventListener("keyup", CONTROLS.keyUpEventHandler);
                CANVAS.addEventListener("keyup", CONTROLS.functionKeyHandler);
                // standard key setup / bindings:
                CONTROLS.bindActionKey(65, "w");  // a key
                CONTROLS.bindActionKey(68, "e");  // d key
                CONTROLS.bindActionKey(87, "n");  // w key
                CONTROLS.bindActionKey(83, "s");  // s key
                CONTROLS.bindActionKey(37, "w");  // left-arrow
                CONTROLS.bindActionKey(39, "e");  // right arrow
                CONTROLS.bindActionKey(38, "n");  // up arrow
                CONTROLS.bindActionKey(40, "s");  // down arrow
                //CONTROLS.bindActionKey(27, "s");  // ESC key [doesn't work...]
                CONTROLS.bindFunctionKey(80, 'pause');
                // everything went OK
                // tell gameManager, that i'm ready
            }
        },
        halt: function () {
            if (CANVAS) {
                // clean up!
                CANVAS.removeEventListener("keydown", CONTROLS.keyDownEventHandeler);
                CANVAS.removeEventListener("keyup", CONTROLS.keyUpEventHandler);
                CANVAS.removeEventListener("keyup", CONTROLS.functionKeyHandler);
                // clear action queue
                for (var i in actions) {
                    if (actions.hasOwnProperty(i)) {
                        actions[i] = false;
                    }
                }
                // clear bindings
                functionBindings = {}; // aż tak drastycznie? nazwa mówi zatrzymaj, nie zniszcz...
                actionBindings = {}; // aż tak drastycznie? nazwa mówi zatrzymaj, nie zniszcz...
            }
        },
        bindFunctionKey: function (key, action) {
            key = +key;
            action = (functions.hasOwnProperty(action)) ? action : null;
            if (action !== null) {
                functionBindings[key] = action;
                return true;
            } else {
                return false;
            }
        },
        bindActionKey: function (key, action) {
            key = +key;
            action = (actions.hasOwnProperty(action)) ? action : null;
            if (action !== null) {
                actionBindings[key] = action;
                return true;
            } else {
                return false;
            }
        }
    });
} ();
