
var Vector2 = function()
{
	this.x = 0;
	this.y = 0;

};

Vector2.prototype.set = function(x , y)
{
	this.x = x;
    this.y = y;
}

Vector2.prototype.CheckCollision = function(Vector2 , a_Other)
{
	if(a_Other.y + a_Other.height < this.y ||
	a_Other.x + a_Other.width < this.x ||
	a_Other.x > this.x + this.width ||
	a_Other.y > this.y + this.height)
	{
		return false;
	}
	return true;
}

Vector2.prototype.magnitude = function ()
{
	return Math.sqrt((x*x) + (y*y));
}

Vector2.prototype.normalised = function()
{
	ret = new Vector2();
	ret.x = this.x / this.magnitude();
	ret.y = this.y / this.magnitude();
	
	return ret;
}