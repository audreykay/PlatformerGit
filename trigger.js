//Exit sign
var Exit = function(x, y) {
	
	this.sprite = new Sprite("signExit.png");
	this.sprite.buildAnimation(1, 1, 70, 70, 1, [0]);
	this.sprite.setAnimationOffset(0, 0, -35);
	
	this.position = new Vector2();
	this.position.set(x, y);
	
};


Exit.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
}

Exit.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}

//BlueKey
var BlueKey = function(x, y) {
	
	this.sprite = new Sprite("keyBlue.png");
	this.sprite.buildAnimation(1, 1, 70, 70, 1, [0]);
	this.sprite.setAnimationOffset(0, 0, -35);
	
	this.position = new Vector2();
	this.position.set(x, y);
	
};


BlueKey.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
}

BlueKey.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}

//GreenKey
var GreenKey = function(x, y) {
	
	this.sprite = new Sprite("keyGreen.png");
	this.sprite.buildAnimation(1, 1, 70, 70, 1, [0]);
	this.sprite.setAnimationOffset(0, 0, -35);
	
	this.position = new Vector2();
	this.position.set(x, y);
	
};


GreenKey.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
}

GreenKey.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}

//RedKey
var RedKey = function(x, y) {
	
	this.sprite = new Sprite("keyRed.png");
	this.sprite.buildAnimation(1, 1, 70, 70, 1, [0]);
	this.sprite.setAnimationOffset(0, 0, -35);
	
	this.position = new Vector2();
	this.position.set(x, y);
	
};


RedKey.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
}

RedKey.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}

//YellowKey
var YellowKey = function(x, y) {
	
	this.sprite = new Sprite("keyYellow.png");
	this.sprite.buildAnimation(1, 1, 70, 70, 1, [0]);
	this.sprite.setAnimationOffset(0, 0, -35);
	
	this.position = new Vector2();
	this.position.set(x, y);
	
};


YellowKey.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
}

YellowKey.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}