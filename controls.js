var CONTROLS = function () {
    'use strict';
    // private members:
    var actions = {     // posible actions in game
        "move-left" : false,
        "move-right" : false,
        "move-up" : false,
        "move-down" : false
    },
    bindings = {        // key boundend with actions
    },
    listening = false;

    // public members:
    return Object.freeze({
        keyDownEventHandler: function (e) {
            console.log("Down: " + e.keyCode);
            var b = bindings[e.keyCode];
            if (actions.hasOwnProperty(b)) {
                actions[b] = true;
            }
        },
        keyUpEventHandler: function (e) {
            console.log("Up: " + e.keyCode);
            var b = bindings[e.keyCode];
            if (actions.hasOwnProperty(b)) {
                actions[b] = false;
                //console.log(b, e.keyCode, "up");
            }
        },
        onClickEventHandler: function (e) {
            console.log('You have clicked on the canvas');
        },
        getActions: function () {
            return actions;
        },
        init: function () {
            if (CANVAS) {
                // append listeners:
                CANVAS.addEventListener("keydown", CONTROLS.keyDownEventHandler);
                CANVAS.addEventListener("keydown", CONTROLS.keyDownEventHandler);
                CANVAS.addEventListener("click", CONTROLS.onClickEventHandler);
                // standard key setup / bindings:
                CONTROLS.bindKey(65, "move-left");    // a
                CONTROLS.bindKey(68, "move-right");   // d
                CONTROLS.bindKey(87, "move-up");      // w
                CONTROLS.bindKey(83, "move-down");    // s
                CONTROLS.bindKey(32, "fire-primary");  // space
                // everything went OK
                // tell gameManager, that i'm ready
                CANVAS.focus();
                console.log('done');
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
                bindings = {};
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
