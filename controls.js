'use strict';

function Controls() {
    this.actions = Object.create(null),   // action fifo queue
    this.actionQueue = [];
    this.bindings = Object.create(null);  // key kode to action bindings
}

Controls.prototype.addBinding = function (action, keyCode) {
    if (action in this.actions) {
        this.bindings[keyCode] = action;
        return true;
    } else {
        return false;
    }
};

Controls.prototype.keyDown = function (event) {
    var binding;

    if (event.keyCode in this.bindings) {
        binding = this.bindings[event.keyCode];

        if (binding instanceof Controls.Handler && binding.on === "down" && binding.action instanceof Function) {
            binding.action();
        } else if (binding in this.actions) {
            this.actions[binding] = true;
        }

    }
};

Controls.prototype.keyUp = function (event) {
    var binding;

    if (event.keyCode in this.bindings) {
        binding = this.bindings[event.keyCode];

        if (binding instanceof Controls.Handler && binding.on === "up" && binding.action instanceof Function) {
            binding.action();
        } else if (binding in this.actions) {
            this.actions[binding] = false;
            this.actionQueue.push(binding);
        }
    }
};

Controls.prototype.getNextAction = function () {
    return this.actionQueue.shift();
}


Controls.createDefualts = function () {
    var instance = new Controls();

    instance.actions.n = false;
    instance.actions.e = false;
    instance.actions.s = false;
    instance.actions.w = false;

    instance.actionQueue = ['n', 'w', 's', 'e'];

    instance.bindings[65] = "w"; // a key
    instance.bindings[68] = "e"; // d key
    instance.bindings[87] = "n"; // w key
    instance.bindings[83] = "s"; // s key
    instance.bindings[37] = "w"; // left-arrow
    instance.bindings[39] = "e"; // right arrow
    instance.bindings[38] = "n"; // up arrow
    instance.bindings[40] = "s"; // down arrow
    //instance.bindings[27] = function () {}; ESC key
    //instance.bindings[80] = function () {}; p key

    return instance;
};

Controls.Handler = function () {
    this.action = null;
    this.on = null;
};
