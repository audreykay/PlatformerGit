var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load an image to draw
var player = new Player();
var keyboard = new Keyboard();
var blueHud = new BlueHud();

//GAME STATES
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var gameState = STATE_SPLASH;

var LAYER_COUNT = 3;
//The number of layers in your map. In the sample from this week’s lesson we’re using
//a background layer, a layer for the platforms, and a layer for the ladders. (We’ll add
//more layers in a later lesson)
var MAP = { tw: 60, th: 15 };
//Specifies how big your level is, in tiles. The sample level from the lesson is 60 tiles
//wide by 15 tiles high.
var TILE = 35;
//The width/height of a tile (in pixels). Your tiles should be square. These dimensions
//refer to the map grid tiles. Our tileset tiles (the images) can be different dimensions.
var TILESET_TILE = TILE * 2;
//The width/height of a tile in the tileset. Because the images are twice as big as the
//grid in our map we need to be careful (but it allows us a bit more flexibility when
//designing the level)
var TILESET_PADDING = 2;
//How many pixels are between the image border and the tile images in the tilemap
var TILESET_SPACING = 2;
//how many pixels are between tile images in the tilemap
var TILESET_COUNT_X = 14;
//How many columns of tile images are in the tileset
var TILESET_COUNT_Y = 14;
//How many rows of tile images are in the tileset

// load the image to use for the level tiles (BEFORE MAP)
var tileset = document.createElement("img");
tileset.src = "tileset.png";


// abitrary choice for 1m
var METER = TILE;
// very exaggerated gravity (6x)
var GRAVITY = METER * 9.8 * 4;
// max horizontal speed (10 tiles per second)
var MAXDX = METER * 10;
// max vertical speed (15 tiles per second)
var MAXDY = METER * 15;
// horizontal acceleration - take 1/2 second to reach maxdx
var ACCEL = MAXDX * 2;
// horizontal friction - take 1/6 second to stop from maxdx
var FRICTION = MAXDX * 6;
// (a large) instantaneous jump impulse
var JUMP = METER * 1500;

var musicBackground;
var sfxFire;

//HUD variables
var exitTrig = {image: document.createElement("img")};
exitTrig.image.src = "signExit.png";


//enemy variables
var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

//arrays
var enemies = [];
var bullets = [];
var exits = [];
var blueKeys = [];
var greenKeys = [];
var redKeys = [];
var yellowKeys = [];

var LAYER_COUNT = 3;

var LAYER_BACKGOUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;
var LAYER_OBJECT_ENEMIES = 3;
var LAYER_OBJECT_TRIGGERS = 4;


var cells = []; // the array that holds our simplified collision data
function initialize() {
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) { // initialize the collision map
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < level1.layers[layerIdx].height; y++) {
			cells[layerIdx][y] = [];
			for(var x = 0; x < level1.layers[layerIdx].width; x++) {
				if(level1.layers[layerIdx].data[idx] != 0) {
					// for each tile we find in the layer data, we need to create 4 collisions
					// (because our collision squares are 35x35 but the tile in the
					// level are 70x70)
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}
				else if(cells[layerIdx][y][x] != 1) {
					// if we haven't set this cell's value, then set it to 0 now
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
		
		// add enemies
		idx = 0;
			for(var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++)
			{
				for(var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++)
				{
					if(level1.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0)
					{
						var px = tileToPixel(x);
						var py = tileToPixel(y);
						var e = new Enemy(px, py);
						enemies.push(e);
					}
					idx++;
				}
			}
			
		// initialize trigger layer in collision map
		cells[LAYER_OBJECT_TRIGGERS] = [];
		idx = 0;
		for(var y = 0; y < level1.layers[LAYER_OBJECT_TRIGGERS].height; y++) {
			cells[LAYER_OBJECT_TRIGGERS][y] = [];
			for(var x = 0; x < level1.layers[LAYER_OBJECT_TRIGGERS].width; x++) {
				if(level1.layers[LAYER_OBJECT_TRIGGERS].data[idx] != 0) {
					
					cells[LAYER_OBJECT_TRIGGERS][y][x] = 1;
					cells[LAYER_OBJECT_TRIGGERS][y-1][x] = 1;
					cells[LAYER_OBJECT_TRIGGERS][y-1][x+1] = 1;
					cells[LAYER_OBJECT_TRIGGERS][y][x+1] = 1;
				
					if(level1.layers[LAYER_OBJECT_TRIGGERS].data[idx] == 163) 
					{
						var px = tileToPixel(x);
						var py = tileToPixel(y);
						var exit = new Exit(px, py);
						exits.push(exit);
					}
					
					if(level1.layers[LAYER_OBJECT_TRIGGERS].data[idx] == 174) 
					{
						var px = tileToPixel(x);
						var py = tileToPixel(y);
						var blue = new BlueKey(px, py);
						blueKeys.push(blue);
					}
					
					if(level1.layers[LAYER_OBJECT_TRIGGERS].data[idx] == 175) 
					{
						var px = tileToPixel(x);
						var py = tileToPixel(y);
						var green = new GreenKey(px, py);
						greenKeys.push(green);
					}
					
					if(level1.layers[LAYER_OBJECT_TRIGGERS].data[idx] == 176) 
					{
						var px = tileToPixel(x);
						var py = tileToPixel(y);
						var red = new RedKey(px, py);
						redKeys.push(red);
					}
					
					if(level1.layers[LAYER_OBJECT_TRIGGERS].data[idx] == 177) 
					{
						var px = tileToPixel(x);
						var py = tileToPixel(y);
						var yellow = new YellowKey(px, py);
						yellowKeys.push(yellow);
					}
					
				
				}
				
				if(cells[LAYER_OBJECT_TRIGGERS][y][x] != 1) {
					// if we haven't set this cell's value, then set it to 0 now
					cells[LAYER_OBJECT_TRIGGERS][y][x] = 0;
				}
				
				
				idx++;
			}
		}
	}
	
	
	
	musicBackground = new Howl(
	{
		urls: ["background.ogg"],
		loop: true,
		buffer: true,
		volume: 0
	} );
	musicBackground.play();
	
	sfxFire = new Howl(
	{
		urls: ["fireEffect.ogg"],
		buffer: true,
		volume: 1,
		onend: function() {
			isSfxPlaying = false;
		}
	} );
}

//BEFORE drawMap
function cellAtPixelCoord(layer, x, y)
{
	if(x < 0 || x > SCREEN_WIDTH || y < 0)
		return 1;
	// let the player drop of the bottom of the screen (this means death)
	if(y > SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
	if(tx < 0 || tx >= MAP.tw || ty < 0)
		return 1;
	// let the player drop of the bottom of the screen (this means death)
	if(ty >= MAP.th)
		return 0;
	return cells[layer][ty][tx];
};

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if(value < min)
		return min;
	if(value > max)
		return max;
	return value;
}

//draw the map
function drawMap()
{
	//calculate screen +2
	var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
	//calculate tile player is on
	var tileX = pixelToTile(player.position.x);
	//calculate offset of player from tile
	var offsetX = TILE + Math.floor(player.position.x%TILE);
	
	//scrolling mechanics
	startX = tileX - Math.floor(maxTiles / 2);
	if(startX < -1)
	{
		startX = 0;
		offsetX = 0;
	}
	if(startX > MAP.tw - maxTiles)
	{
		startX = MAP.tw - maxTiles + 1;
		offsetX = TILE;
	}
	
	//x-axis offset (amount of world scrolled)
	worldOffsetX = startX * TILE + offsetX;
	
	for( var layerIdx=0; layerIdx < LAYER_COUNT; layerIdx++ )
	{
		for( var y = 0; y < level1.layers[layerIdx].height; y++ )
		{
			var idx = y * level1.layers[layerIdx].width + startX;
			for( var x = startX; x < startX + maxTiles; x++ )
			{
				if( level1.layers[layerIdx].data[idx] != 0 )
				{
					// the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile),
					// so subtract one from the tileset id to get the
					// correct tile
					var tileIndex = level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) *
						(TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) *
						(TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE,
						(x-startX)*TILE - offsetX, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
	
}

//GAME STATES
function runSplash(deltaTime)
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true) {
		gameState = STATE_GAME;
		return;
	}
	
	context.fillStyle = "#000";
	context.font="24px Arial";
	context.fillText("SPLASH SCREEN", 200, 240);
}

function runGame(deltaTime)
{
		//background
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	//deltaTime
	var deltaTime = getDeltaTime();
	
	//SWITCHING GAME STATES
	switch(gameState)
	{
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
		case STATE_GAME:
			run(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
	}
}

function runGameOver(deltaTime)
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	context.fillStyle = "#000";
	context.font="24px Arial";
	context.fillText("GAME OVER", 200, 240);
}

//run function
function run()
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);

	var deltaTime = getDeltaTime();
	
	player.update(deltaTime);
	drawMap();
	player.draw();
	blueHud.update(deltaTime);
	blueHud.draw();
	
	
	
	// update the frame counter

	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	
	//enemies
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].update(deltaTime);
	}
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].draw(deltaTime);
	}
	
	//triggers
	
	//exit
		for(var i=0; i<exits.length; i++)
	{
		exits[i].update(deltaTime);
	}
	for(var i=0; i<exits.length; i++)
	{
		exits[i].draw(deltaTime);
	}
	
	//blueKeys
		for(var i=0; i<blueKeys.length; i++)
	{
		blueKeys[i].update(deltaTime);
	}
	for(var i=0; i<blueKeys.length; i++)
	{
		blueKeys[i].draw(deltaTime);
	}
	//greenKeys
		for(var i=0; i<greenKeys.length; i++)
	{
		greenKeys[i].update(deltaTime);
	}
	for(var i=0; i<greenKeys.length; i++)
	{
		greenKeys[i].draw(deltaTime);
	}
	
	//redKeys
		for(var i=0; i<redKeys.length; i++)
	{
		redKeys[i].update(deltaTime);
	}
	for(var i=0; i<redKeys.length; i++)
	{
		redKeys[i].draw(deltaTime);
	}
	
	//yellowKeys
		for(var i=0; i<yellowKeys.length; i++)
	{
		yellowKeys[i].update(deltaTime);
	}
	for(var i=0; i<yellowKeys.length; i++)
	{
		yellowKeys[i].draw(deltaTime);
	}
	
	
	
	
	
	//bullets
	var hit=false;
	for(var i=0; i<bullets.length; i++)
		{
			bullets[i].draw(deltaTime);
			bullets[i].update(deltaTime);
			if( bullets[i].position.x - worldOffsetX < 0 ||
				bullets[i].position.x - worldOffsetX > SCREEN_WIDTH)
			{
				hit = true;
			}
			
			for(var j=0; j<enemies.length; j++)
			{
				if(intersects( bullets[i].position.x, bullets[i].position.y, TILE, TILE,
				enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
				{
					// kill both the bullet and the enemy
					enemies.splice(j, 1);
					hit = true;
					// increment the player score
					score += 1;
					break;
				}
			}
			if(hit == true)
			{
				bullets.splice(i, 1);
				break;
			}
			
		}
	
	
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].draw(deltaTime);
	}
}

//initialize AFTER run function
initialize();

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
