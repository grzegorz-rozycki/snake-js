'use strict';
// ToDo:
// implement just image / atlas loading /drawing methods / assets
function oEmpty() {
    return (Object.create ? Object.create(null) : {});
}
// class Rectangle
function Rectangle(x, y, w, h) {
    // constructor
    x = typeof x !== "number" ? 0 : x;
    y = typeof y !== "number" ? 0 : y;
    h = typeof h !== "number" ? 0 : h;
    w = typeof w !== "number" ? 0 : w;

    this.w = w;             // width
    this.h = h;             // height
    this.t = y;             // top
    this.b = y + h;         // bottom
    this.l = x;             // left
    this.r = x + w;         // right
    this.cx = x + w / 2 ;   // center x
    this.cy = y + h / 2;    // center y
}
// Rectangle.prototype = oEmpty();
Rectangle.prototype = {

};

var GRAPHICS = (function () {
    // private:
    var assets = {},
        layers = [],
        canvas = null,
        API = Object.create(null),
        canvasW = null,
        canvasH = null,
        ctx = null;

    // helper class
    function Properties(x, y, w, h) {
        x = typeof x === "number" ? x : 0;
        y = typeof y === "number" ? y : 0;
        h = typeof h === "number" ? h : 0;
        w = typeof w === "number" ? w : 0;

        this.physicsBody = null;
        this.name = null;
        this.die = false;

        this.w = w;             // width
        this.h = h;             // height
        this.t = y;             // top
        this.b = y + h;         // bottom
        this.l = x;             // left
        this.r = x + w;         // right
        this.cx = x + w / 2 ;   // center x
        this.cy = y + h / 2;    // center y
    }
    Properties.prototype = {
        overlap: function (a) {
            var ans = false;
            if (a instanceof Asset) {
                return this.r >= a.l && a.r >= this.l && a.b >= this.t && a.t <= this.b;
            }
            return ans;
        }
    };

    function Asset(frames) {
        if (frames instanceof Array) {
            this.frames = frames;
            this.ptr = 0;
            // load frames!
        } else {
            throw new TypeError('GRAPHICS new Asset: frames must be of type Array');
        }
    };
    Asset.prototype = {};

    // helper functions
    function arcToXY(x, y, r, rad) {
        var xp = 0,
            yp = 0;
        xp = Math.cos(rad) * r + x;
        yp = Math.sin(rad) * r + y;
        return [xp, yp];
    }
    function toRadians(deg) {
        return (Math.PI / 180) * deg;
    }
    function toDegrees(rad) {
        return (180 * rad) / Math.PI;
    }
    function loadAsset(name, frames) {
        assets[name] = new Asset(frames);
    }
    function drawObject(asset, name, layer, x, y, properties) {

    }
    // add public methods
    API.init = function (canvasName) {
        var ans;
        canvas = document.getElementById(canvasName);
        if (canvas) {
            canvasH = canvas.height;
            canvasW = canvas.width;
            ctx = canvas.getContext('2d');
            console.log('OK', canvasW, canvasH);
            // tmp: draw pacman
            ctx.save();
            ctx.fillStyle = '#FFE400';
            ctx.arc(100, 100, 20, toRadians(0), toRadians(360), true);
            //ctx.beginPath();

            //ctx.quadraticCurveTo(75, 75, 100, 50);
            //ctx.arcTo(100, 200, 100, 50, 50);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        } else {
            throw new Error('GRAPHICS.init: no element with id=' + canvasName);
        }
    };
    API.loadAssets = function (list) {
        var l = null,
            i = null;
        if (!(list instanceof Array)) {
            throw new TypeError('GRAPHICS.loadAssets: list must be of type Array');
        }
        for (i = 0, l = list.length; i < l; i += 1) {
            loadAsset(list[i].name, list[i].frames);
        }
    }
    // freeze [if possible] and make the API public:
    return Object.freeze(API);
} ());
