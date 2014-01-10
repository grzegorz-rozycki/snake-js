'use strict';
// global variable config
var CONF = Object.create(null);
CONF.canvasName = 'canvas';     // id of canvas element to draw to
CONF.tileSize = 10;             // size of tile in pixels
CONF.mapHeight = 40;            // game map height in tiles; pixels = tileSize * mapHeight
CONF.mapWidth = 80;             // game map width in tiles; pixels = tileSize * mapWidth
CONF.initLength = 1;            // initial length of the snake in tiles
// position to place snake at the begining; in tiles
CONF.initPosition = [Math.floor(CONF.mapWidth / 2), Math.floor(CONF.mapHeight / 2)];
CONF.ppf = 5;                   // points per fruit collected by snake
CONF.speed = 1;                 // snake movement speed [i.e. how many frames skip before move by a tile]
CONF.fps = Math.floor(1000 / 1);// framerate 60Hz [well, if we'll skip on using getNextAnimationFrame]
