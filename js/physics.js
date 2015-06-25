'use strict';

function Physics(mapWidth, mapHeight) {
    this.isOver = false;
    this.handlers = Object.create(null);
    this.actions = null;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.fruit = null,
    this.movement = null,
    this.snake = null;

    this.handlers[Physics.COLLISION_EVENT] = [];
    this.handlers[Physics.COLLECTION_EVENT] = [];
}

Physics.COLLISION_EVENT = 'COLLISION_EVENT';
Physics.COLLECTION_EVENT = 'COLLECTION_EVENT';

Physics.prototype.addHandler = function (eventType, handler) {

    if (eventType in this.handlers && handler instanceof Function) {
        this.handlers[eventType].push(handler);
        return true;
    }

    return false;
}

Physics.prototype.removeHandler = function (eventType, handler) {
    var index;

    if (eventType in this.handlers) {
        if ((index = this.handlers[eventType].indexOf(handler)) != -1) {
            this.handlers[eventType].splice(index, 1);

            return true;
        }
    }

    return false;
}

Physics.prototype.purgeHandlers = function (eventType) {

    if (eventType in this.handlers) {
        this.handlers[eventType] = [];

        return true;
    }

    return false;
}

Physics.prototype.callHandlers = function (eventType) {

    if (eventType in this.handlers) {
        this.handlers[eventType].forEach(function (o) { o.call(); });
    }

}

Physics.prototype.checkForColisions = function () {
    var l = (this.snake.length - 1),
        i = 1;

    // border collision
    if (
        this.snake[0][0] <= 0 ||
        this.snake[0][1] <= 0 ||
        this.snake[0][0] >= (this.mapWidth - 1) ||
        this.snake[0][1] >= (this.mapHeight - 1)
    ) {
        return true;
    }

    // self collision
    for (; i < l; i += 1) {
        if (
            (this.snake[0][0] === this.snake[i][0]) &&
            (this.snake[0][1] === this.snake[i][1])
        ) {
            return true;
        }
    }

    return false
};

Physics.prototype.fruitCollected = function () {
    return (this.fruit[0] === this.snake[0][0] && this.fruit[1] === this.snake[0][1]);
};

Physics.prototype.getDirection = function (newMovement) {

    if (newMovement === 'n' && this.movement !== 's') {
        return 'n';
    }

    if (newMovement === 'e' && this.movement !== 'w') {
        return 'e';
    }

    if (newMovement === 's' && this.movement !== 'n') {
        return 's';
    }

    if (newMovement === 'w' && this.movement !== 'e') {
        return 'w';
    }

    return this.movement;
};

Physics.prototype.moveSnake = function (newMovement) {
    var i = (this.snake.length - 1);

    this.movement = this.getDirection(newMovement);

    for (; i > 0; i -= 1) {
        this.snake[i][0] = this.snake[i - 1][0];
        this.snake[i][1] = this.snake[i - 1][1];
    }

    switch (this.movement) {
        case 'n':
            this.snake[0][1] -= 1;
            break;
        case 's':
            this.snake[0][1] += 1;
            break;
        case 'w':
            this.snake[0][0] -= 1;
            break;
        case 'e':
            this.snake[0][0] += 1;
            break;
        default:
            throw new Error('PHYSICS: unknown movement direction: ' + this.movement);
    }
};

Physics.prototype.moveFruit = function () {
    var x = Math.round(Math.random() * (this.mapWidth - 3) + 1),
        y = Math.round(Math.random() * (this.mapHeight - 3) + 1),
        clean = true,
        li = null,
        lj = null,
        ls = null,
        s = null,
        i = null,
        j = null;
    // check if random position is outsiede of snake body
    for (s = 0, ls = this.snake.length; s < ls; s += 1) {
        if ((x === this.snake[s][0]) && (y === this.snake[s][1])) {
            clean = false;
            break;
        }
    }
    // random point din't fit outside snake body
    // search for empty point, starting from x, y
    if (clean !== true) {
        for (i = 1, li = (this.mapHeight - 1); i < li; i += 1) {
            for (j = 1, lj = (this.mapWidth - 1); j < lj; j += 1) {
                x = ((x + j) % (this.mapWidth - 2) + 1);    // whoa, nice :)
                y = ((y + i) % (this.mapHeight - 2) + 1);    // whoa, nice :)
                clean = true;

                for (s = 0; s < ls; s += 1) {
                    if ((x === this.snake[s][0]) && (y === this.snake[s][1])) {
                        clean = false;
                        break;
                    }
                }

                if (clean) {
                    this.fruit[0] = x;
                    this.fruit[1] = y;
                    return ;
                }
            }
        }
    } else {
        this.fruit[0] = x;
        this.fruit[1] = y;
    }
};

Physics.prototype.init = function (initLength, initPosition) {
    var i = 0;

    this.movement = 'e';
    this.fruit = [];
    this.snake = [];

    for (; i < initLength; i += 1) {
        this.snake.push([initPosition[0] - i, initPosition[1]]);
        //snake.push(CONF.initPosition); // this pushes the reference
        //snake.push(Object.create(CONF.initPosition)); // this clones the object
    }
    this.moveFruit();
};

Physics.prototype.step = function (newMovement) {
    var tail = this.snake.length - 1;

    if (this.isOver) {
        return;
    }

    this.moveSnake(newMovement);

    if (this.fruitCollected()) {
        this.snake.push([this.snake[tail][0], this.snake[tail][1]]);
        this.moveFruit();
        this.callHandlers(Physics.COLLECTION_EVENT);
    }
    if (this.checkForColisions()) {
        this.callHandlers(Physics.COLLISION_EVENT);
        this.isOver = true;
    }
};
