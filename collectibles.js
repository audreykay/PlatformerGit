var BlueHud = function(x, y)
{
	this.sprite = new Sprite("hud_keyBlue.png");
	this.sprite.buildAnimation(1, 1, 44, 40, -1, [0]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);
	
	this.position = new Vector2();
	this.position.set(100 , 100);
	
}
BlueHud.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
}

BlueHud.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}
